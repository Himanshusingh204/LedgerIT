import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Integration tests against a LIVE Supabase instance (the local stack — `npx supabase start`).
// Skipped automatically if the env vars aren't set (e.g. in CI, which doesn't run Supabase) rather
// than failing — see CLAUDE.md §9 for how to start the local stack for running these.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Probe whether live local Supabase stack is running and responsive.
let hasLiveSupabase = false;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      signal: AbortSignal.timeout(800),
    });
    hasLiveSupabase = res.ok;
  } catch {
    hasLiveSupabase = false;
  }
}

async function signUpTestUser() {
  // persistSession/autoRefreshToken off: multiple client instances in this same test file would
  // otherwise all read/write the same jsdom `window.localStorage`, clobbering each other's session
  // — each client here relies purely on the in-memory session signUp() sets on itself.
  const client = createClient<Database>(supabaseUrl!, supabaseKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const email = `rls-test-${crypto.randomUUID()}@example.com`;
  const password = "TestPassword123!";
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Sign-up did not return a user — is enable_confirmations on?");
  return { client, userId: data.user.id };
}

describe.skipIf(!hasLiveSupabase)("Row-level security (live Supabase)", () => {
  it("an account created by one user is invisible to another user", async () => {
    const userA = await signUpTestUser();
    const userB = await signUpTestUser();

    const { data: account, error: createError } = await userA.client
      .from("accounts")
      .insert({ user_id: userA.userId, name: "User A's account", type: "bank", opening_balance: 100 })
      .select()
      .single();
    expect(createError).toBeNull();
    expect(account).not.toBeNull();

    const { data: visibleToB, error: readError } = await userB.client
      .from("accounts")
      .select("*")
      .eq("id", account!.id);
    expect(readError).toBeNull();
    expect(visibleToB).toEqual([]);

    const { data: visibleToA } = await userA.client.from("accounts").select("*").eq("id", account!.id);
    expect(visibleToA).toHaveLength(1);
  });

  it("inserting an account with a spoofed user_id is rejected", async () => {
    const userA = await signUpTestUser();
    const userB = await signUpTestUser();

    const { error } = await userA.client
      .from("accounts")
      .insert({ user_id: userB.userId, name: "Spoofed", type: "bank", opening_balance: 0 });

    expect(error).not.toBeNull();
  });

  it("system categories (user_id null) are readable by any authenticated user", async () => {
    const userA = await signUpTestUser();
    const { data, error } = await userA.client.from("categories").select("*").is("user_id", null);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });
});
