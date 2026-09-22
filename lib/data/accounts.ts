import type { SupabaseClient } from "@supabase/supabase-js";
import type { Account, AccountType, Database, Transaction } from "@/types/database";
import { calculateAccountBalance } from "@/lib/finance/calculations";

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

export interface AccountWithBalance extends Account {
  balance: number;
}

/**
 * A balance has to reflect the account's full transaction history, not just whatever date range
 * the dashboard happens to be showing — so this pulls every transaction ever posted to the user's
 * accounts (not just the current period), which the dashboard's other queries don't need to do.
 *
 * Deliberately NOT capped with a row limit the way `listTransactionsInRange` is (see
 * lib/data/transactions.ts): truncating a date range yields an honest "partial totals for this
 * period" that's fine to show with a warning, but truncating this query would produce a balance
 * that's simply wrong, silently, with no way to flag it as partial. If this ever needs a real cap
 * for a pathological account, the right fix is a Postgres aggregate (a `sum(...) group by
 * account_id, type` view or RPC function) so the database does the summing, not truncating what
 * gets pulled into the app.
 */
export async function listAccountsWithBalances(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<AccountWithBalance[]> {
  const [accounts, { data: transactions, error }] = await Promise.all([
    listAccounts(supabase, userId),
    supabase.from("transactions").select("account_id, type, amount").eq("user_id", userId),
  ]);

  if (error) throw error;

  const transactionsByAccount = new Map<string, Pick<Transaction, "type" | "amount">[]>();
  for (const tx of transactions ?? []) {
    const bucket = transactionsByAccount.get(tx.account_id) ?? [];
    bucket.push({ type: tx.type, amount: tx.amount });
    transactionsByAccount.set(tx.account_id, bucket);
  }

  return accounts.map((account) => ({
    ...account,
    balance: calculateAccountBalance(account.opening_balance, transactionsByAccount.get(account.id) ?? []),
  }));
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
