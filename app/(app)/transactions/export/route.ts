import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listAccounts } from "@/lib/data/accounts";
import { listCategories } from "@/lib/data/categories";
import { listTransactions } from "@/lib/data/transactions";
import type { TransactionType } from "@/types/database";

const TRANSACTION_TYPES = new Set<TransactionType>(["expense", "income", "transfer"]);
const EXPORT_LIMIT = 10_000;

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const typeParam = url.searchParams.get("type");

  const [accounts, categories, { transactions }] = await Promise.all([
    listAccounts(supabase, user.id, true),
    listCategories(supabase),
    listTransactions(supabase, user.id, {
      page: 1,
      pageSize: EXPORT_LIMIT,
      search: url.searchParams.get("search") ?? undefined,
      accountId: url.searchParams.get("accountId") ?? undefined,
      categoryId: url.searchParams.get("categoryId") ?? undefined,
      type: typeParam && TRANSACTION_TYPES.has(typeParam as TransactionType) ? (typeParam as TransactionType) : undefined,
    }),
  ]);

  const accountsById = new Map(accounts.map((account) => [account.id, account.name]));
  const categoriesById = new Map(categories.map((category) => [category.id, category.name]));

  const header = ["Date", "Type", "Merchant", "Category", "Account", "Amount", "Currency", "Note"];
  const rows = transactions.map((transaction) => [
    transaction.occurred_at.slice(0, 10),
    transaction.type,
    transaction.merchant ?? "",
    transaction.category_id ? categoriesById.get(transaction.category_id) ?? "" : "",
    accountsById.get(transaction.account_id) ?? "",
    transaction.amount.toFixed(2),
    transaction.currency,
    transaction.note ?? "",
  ]);

  const csv = [header, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="transactions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
