import { createClient } from "@supabase/supabase-js";

// Service-role client. Server-only: only import from server actions / route handlers.
// Bypasses RLS, so never pass its result to the browser without re-checking ownership.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
