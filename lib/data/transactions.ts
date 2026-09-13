import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Transaction, TransactionType } from "@/types/database";

export interface TransactionFilters {
  from?: string;
  to?: string;
  categoryId?: string;
  accountId?: string;
  type?: TransactionType;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface TransactionPage {
  transactions: Transaction[];
  total: number;
}

export async function listTransactions(
  supabase: SupabaseClient<Database>,
  userId: string,
  filters: TransactionFilters = {},
): Promise<TransactionPage> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 25;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("occurred_at", { ascending: false })
    .range(from, to);

  if (filters.from) query = query.gte("occurred_at", filters.from);
  if (filters.to) query = query.lt("occurred_at", filters.to);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.accountId) query = query.eq("account_id", filters.accountId);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.search) query = query.ilike("merchant", `%${filters.search}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return { transactions: data ?? [], total: count ?? 0 };
}

export async function listTransactionsInRange(
  supabase: SupabaseClient<Database>,
  userId: string,
  from: string,
  to: string,
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("occurred_at", from)
    .lt("occurred_at", to);

  if (error) throw error;
  return data ?? [];
}

export interface CreateTransactionInput {
  accountId: string;
  categoryId: string | null;
  type: TransactionType;
  amount: number;
  merchant?: string;
  note?: string;
  occurredAt: string;
}

export async function createTransaction(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateTransactionInput,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      account_id: input.accountId,
      category_id: input.categoryId,
      type: input.type,
      amount: input.amount,
      merchant: input.merchant ?? null,
      note: input.note ?? null,
      occurred_at: input.occurredAt,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransaction(
  supabase: SupabaseClient<Database>,
  id: string,
  input: Partial<CreateTransactionInput>,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      account_id: input.accountId,
      category_id: input.categoryId,
      type: input.type,
      amount: input.amount,
      merchant: input.merchant,
      note: input.note,
      occurred_at: input.occurredAt,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTransaction(supabase: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
