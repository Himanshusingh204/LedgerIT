import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// @supabase/ssr's own DEFAULT_COOKIE_OPTIONS never sets `secure` at all (only path/sameSite/
// httpOnly/maxAge) — it has to default to false so the auth cookie still works over plain HTTP in
// local dev, but that means it silently stays false in production too unless set explicitly here.
// (`httpOnly: true` is NOT set here on purpose: this browser client reads the same cookie back via
// JS on page load to rehydrate the session client-side — httpOnly would break that. The real
// mitigations against XSS token theft are the short-lived 1hr access token, refresh-token rotation,
// and the CSP in lib/supabase/middleware.ts, not httpOnly on this particular cookie.)
const cookieOptions = { secure: process.env.NODE_ENV === "production" };

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookieOptions },
  );
}
