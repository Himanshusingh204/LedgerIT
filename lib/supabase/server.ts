import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Keep in sync with lib/supabase/client.ts — see the comment there for why `secure` is set
// explicitly (the library's own defaults never set it) and `httpOnly` deliberately isn't.
const cookieOptions = { secure: process.env.NODE_ENV === "production" };

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component without a mutable cookie jar.
            // Session refresh is handled by middleware instead — safe to ignore.
          }
        },
      },
    },
  );
}
