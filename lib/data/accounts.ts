import type { SupabaseClient } from "@supabase/supabase-js";
import type { Account, AccountType, Database } from "@/types/database";

export async function listAccounts(
  supabase: SupabaseClient<Database>,
  userId: string,
  includeArchived = false,
): Promise<Account[]> {
  let query = supabase.from("accounts").select("*").eq("user_id", userId).order("created_at", { ascending: true });
  if (!includeArchived) query = query.eq("is_archived", false);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function archiveAccount(supabase: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await supabase.from("accounts").update({ is_archived: true }).eq("id", id);
  if (error) throw error;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  currency: string;
  lastFour?: string;
  openingBalance: number;
}

export async function createAccount(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateAccountInput,
): Promise<Account> {
  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      name: input.name,
      type: input.type,
      currency: input.currency,
      last_four: input.lastFour || null,
      opening_balance: input.openingBalance,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
