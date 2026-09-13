"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Receipt } from "lucide-react";
import type { Account, Category, Transaction } from "@/types/database";
import { formatSignedCurrency } from "@/lib/formatters/currency";
import { deleteTransactionAction } from "@/lib/actions/transactions";
import { CategoryIcon } from "@/components/shared/category-icon";
import { Dialog } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/transaction-form";

function amountTone(type: Transaction["type"]) {
  if (type === "income") return "text-success";
  if (type === "expense") return "text-danger";
  return "text-foreground";
}

function signedAmount(transaction: Transaction) {
  const magnitude = transaction.type === "expense" ? -transaction.amount : transaction.amount;
  return formatSignedCurrency(magnitude, transaction.currency);
}

export function TransactionList({
  transactions,
  accounts,
  categories,
}: {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
}) {
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const accountsById = new Map(accounts.map((account) => [account.id, account]));
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  function handleDelete(id: string) {
    if (!window.confirm("Delete this transaction? This can't be undone.")) return;
    setPendingDeleteId(id);
    startTransition(async () => {
      await deleteTransactionAction(id);
      setPendingDeleteId(null);
    });
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius-surface)] border border-dashed border-border bg-surface py-16 text-center">
        <Receipt className="h-8 w-8 text-foreground-muted" aria-hidden />
        <p className="font-medium text-foreground">No transactions found</p>
        <p className="max-w-xs text-sm text-foreground-muted">
          Try adjusting your filters, or add your first transaction to start tracking spending.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-[var(--radius-surface)] border border-border bg-surface sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wide text-foreground-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Merchant</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              <th className="px-4 py-3 text-right font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => {
              const category = transaction.category_id ? categoriesById.get(transaction.category_id) : undefined;
              return (
                <tr key={transaction.id} className="hover:bg-surface-muted/60">
                  <td className="whitespace-nowrap px-4 py-3 text-foreground-muted">
                    {new Date(transaction.occurred_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {transaction.merchant || "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {category ? (
                      <span className="inline-flex items-center gap-1.5">
                        <CategoryIcon icon={category.icon} className="h-3.5 w-3.5" />
                        {category.name}
                      </span>
                    ) : (
                      "Uncategorized"
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {accountsById.get(transaction.account_id)?.name ?? "—"}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium tabular-nums ${amountTone(transaction.type)}`}>
                    {signedAmount(transaction)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(transaction)}
                        aria-label={`Edit transaction with ${transaction.merchant || "no merchant"}`}
                        className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                        disabled={isPending && pendingDeleteId === transaction.id}
                        aria-label={`Delete transaction with ${transaction.merchant || "no merchant"}`}
                        className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] text-foreground-muted hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-2 sm:hidden">
        {transactions.map((transaction) => {
          const category = transaction.category_id ? categoriesById.get(transaction.category_id) : undefined;
          return (
            <li
              key={transaction.id}
              className="rounded-[var(--radius-surface)] border border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{transaction.merchant || "—"}</p>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    {new Date(transaction.occurred_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {category?.name ?? "Uncategorized"} · {accountsById.get(transaction.account_id)?.name ?? "—"}
                  </p>
                </div>
                <span className={`font-medium tabular-nums ${amountTone(transaction.type)}`}>
                  {signedAmount(transaction)}
                </span>
              </div>
              <div className="mt-3 flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(transaction)}
                  aria-label={`Edit transaction with ${transaction.merchant || "no merchant"}`}
                  className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(transaction.id)}
                  disabled={isPending && pendingDeleteId === transaction.id}
                  aria-label={`Delete transaction with ${transaction.merchant || "no merchant"}`}
                  className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] text-foreground-muted hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {editing ? (
        <Dialog title="Edit transaction" onClose={() => setEditing(null)}>
          <TransactionForm
            accounts={accounts}
            categories={categories}
            transaction={editing}
            onSuccess={() => setEditing(null)}
          />
        </Dialog>
      ) : null}
    </>
  );
}
