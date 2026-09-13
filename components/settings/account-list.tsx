"use client";

import { useState, useTransition } from "react";
import { Archive, Wallet } from "lucide-react";
import type { Account } from "@/types/database";
import { formatCurrency } from "@/lib/formatters/currency";
import { archiveAccountAction } from "@/lib/actions/accounts";
import { AddAccountForm } from "@/components/settings/add-account-form";

const ACCOUNT_TYPE_LABELS: Record<Account["type"], string> = {
  cash: "Cash",
  bank: "Bank account",
  debit_card: "Debit card",
  credit_card: "Credit card",
  other: "Other",
};

export function AccountList({ accounts }: { accounts: Account[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleArchive(id: string) {
    if (!window.confirm("Archive this account? Its transaction history is kept.")) return;
    setPendingId(id);
    startTransition(async () => {
      await archiveAccountAction(id);
      setPendingId(null);
    });
  }

  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground-muted">Accounts</h2>
      </div>

      {accounts.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
          <Wallet className="h-6 w-6 text-foreground-muted" aria-hidden />
          <p className="text-sm text-foreground-muted">No accounts yet. Add one to start tracking transactions.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {accounts.map((account) => (
            <li key={account.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {account.name}
                  {account.last_four ? <span className="text-foreground-muted"> ····{account.last_four}</span> : null}
                </p>
                <p className="text-xs text-foreground-muted">
                  {ACCOUNT_TYPE_LABELS[account.type]} · {formatCurrency(account.opening_balance, account.currency)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleArchive(account.id)}
                disabled={isPending && pendingId === account.id}
                aria-label={`Archive ${account.name}`}
                className="flex items-center gap-1.5 rounded-[var(--radius-control)] px-2 py-1.5 text-xs font-medium text-foreground-muted hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
              >
                <Archive className="h-3.5 w-3.5" />
                Archive
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <AddAccountForm />
      </div>
    </div>
  );
}
