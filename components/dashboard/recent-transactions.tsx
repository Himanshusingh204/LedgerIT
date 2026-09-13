import Link from "next/link";
import { Receipt } from "lucide-react";
import type { Account, Category, Transaction } from "@/types/database";
import { formatSignedCurrency } from "@/lib/formatters/currency";
import { CategoryIcon } from "@/components/shared/category-icon";

function amountTone(type: Transaction["type"]) {
  if (type === "income") return "text-success";
  if (type === "expense") return "text-danger";
  return "text-foreground";
}

export function RecentTransactions({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
}) {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground-muted">Recent transactions</h2>
        <Link href="/transactions" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
          <Receipt className="h-6 w-6 text-foreground-muted" aria-hidden />
          <p className="text-sm text-foreground-muted">No transactions yet this period.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {transactions.map((transaction) => {
            const category = transaction.category_id ? categoriesById.get(transaction.category_id) : undefined;
            return (
              <li key={transaction.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-surface-muted text-foreground-muted">
                    <CategoryIcon icon={category?.icon ?? "circle"} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{transaction.merchant || "—"}</p>
                    <p className="text-xs text-foreground-muted">{category?.name ?? "Uncategorized"}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium tabular-nums ${amountTone(transaction.type)}`}>
                  {formatSignedCurrency(transaction.type === "expense" ? -transaction.amount : transaction.amount, transaction.currency)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
