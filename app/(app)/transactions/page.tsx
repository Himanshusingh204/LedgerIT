import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { listAccounts } from "@/lib/data/accounts";
import { listCategories } from "@/lib/data/categories";
import { listTransactions } from "@/lib/data/transactions";
import type { TransactionType } from "@/types/database";
import { AddTransactionButton } from "@/components/transactions/add-transaction-button";
import { ExportButton } from "@/components/transactions/export-button";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionPagination } from "@/components/transactions/transaction-pagination";

export const metadata: Metadata = {
  title: "Transactions",
};

const PAGE_SIZE = 25;
const TRANSACTION_TYPES = new Set<TransactionType>(["expense", "income", "transfer"]);

export default async function TransactionsPage({ searchParams }: PageProps<"/transactions">) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">Your session expired. Please sign in again.</p>
      </div>
    );
  }

  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const typeParam = typeof params.type === "string" ? params.type : undefined;

  let data: {
    accounts: Awaited<ReturnType<typeof listAccounts>>;
    categories: Awaited<ReturnType<typeof listCategories>>;
    transactions: Awaited<ReturnType<typeof listTransactions>>["transactions"];
    total: number;
  } | null = null;
  let loadError = false;

  try {
    const [accounts, categories, transactionPage] = await Promise.all([
      listAccounts(supabase, user.id),
      listCategories(supabase),
      listTransactions(supabase, user.id, {
        page,
        pageSize: PAGE_SIZE,
        search: typeof params.search === "string" ? params.search : undefined,
        accountId: typeof params.accountId === "string" ? params.accountId : undefined,
        categoryId: typeof params.categoryId === "string" ? params.categoryId : undefined,
        type: typeParam && TRANSACTION_TYPES.has(typeParam as TransactionType) ? (typeParam as TransactionType) : undefined,
      }),
    ]);
    data = { accounts, categories, transactions: transactionPage.transactions, total: transactionPage.total };
  } catch {
    loadError = true;
  }

  if (loadError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">
          Something went wrong loading your transactions. Please try refreshing the page.
        </p>
      </div>
    );
  }

  const { accounts, categories, transactions, total } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Transactions</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {total} transaction{total === 1 ? "" : "s"} total
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton />
          <AddTransactionButton accounts={accounts} categories={categories} />
        </div>
      </div>

      {accounts.length === 0 ? (
        <p className="mt-4 rounded-[var(--radius-control)] bg-warning/10 px-3 py-2 text-sm text-warning">
          Add an account before recording transactions.
        </p>
      ) : null}

      <div className="mt-6">
        <TransactionFilters accounts={accounts} categories={categories} />
      </div>

      <div className="mt-4">
        <TransactionList transactions={transactions} accounts={accounts} categories={categories} />
      </div>

      <div className="mt-4">
        <TransactionPagination page={page} pageSize={PAGE_SIZE} total={total} />
      </div>
    </div>
  );
}
