import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const PROTECTED_PREFIXES = ["/dashboard", "/transactions", "/budgets", "/analytics", "/settings"];

/**
 * Content-Security-Policy is built per-request (not in next.config.ts) because it needs a fresh
 * nonce every time — Next.js reads the nonce off this same header on the request side to
 * automatically allow its own hydration/RSC-payload inline scripts. See
 * https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy.
 * Everything that doesn't need a nonce (HSTS, X-Frame-Options, etc.) lives in next.config.ts.
 */
function buildCsp(nonce: string, supabaseUrl: string | undefined): string {
  const connectSrc = ["'self'", supabaseUrl].filter(Boolean).join(" ");

  const isProduction = process.env.NODE_ENV === "production";

  // React's dev-mode debugging (reconstructing call stacks) uses eval() — harmless on localhost
  // and never used in a production build, so it's only allowed outside production.
  const scriptSrc = isProduction
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `script-src 'self' 'unsafe-eval' 'nonce-${nonce}' 'strict-dynamic'`;

  const directives = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'", // React inline `style={{...}}` (e.g. budget progress bars) needs this
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `connect-src ${connectSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  // Only force HTTPS upgrades outside local dev — the local Supabase stack serves plain HTTP on
  // 127.0.0.1, and `upgrade-insecure-requests` would silently break every browser call to it.
  if (isProduction) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export async function updateSession(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce, process.env.NEXT_PUBLIC_SUPABASE_URL);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
  supabaseResponse.headers.set("Content-Security-Policy", csp);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // No Supabase project configured yet (e.g. fresh checkout without .env.local) —
  // let public marketing pages render instead of hard-crashing every request.
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
          supabaseResponse.headers.set("Content-Security-Policy", csp);
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  if (!user && isProtected) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    const redirectResponse = NextResponse.redirect(signInUrl);
    redirectResponse.headers.set("Content-Security-Policy", csp);
    return redirectResponse;
  }

  return supabaseResponse;
}
