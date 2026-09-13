import Link from "next/link";
import { Wallet } from "lucide-react";
import type { Account } from "@/types/database";
import { formatCurrency } from "@/lib/formatters/currency";

const ACCOUNT_TYPE_LABELS: Record<Account["type"], string> = {
  cash: "Cash",
  bank: "Bank account",
  debit_card: "Debit card",
  credit_card: "Credit card",
  other: "Other",
};

export function AccountsSummary({ accounts }: { accounts: Account[] }) {
  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-5">
      <h2 className="text-sm font-medium text-foreground-muted">Accounts</h2>

      {accounts.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
          <Wallet className="h-6 w-6 text-foreground-muted" aria-hidden />
          <p className="text-sm text-foreground-muted">No accounts yet.</p>
          <Link href="/settings" className="text-sm font-medium text-primary hover:underline">
            Add an account
          </Link>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {accounts.map((account) => (
            <li key={account.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{account.name}</p>
                <p className="text-xs text-foreground-muted">{ACCOUNT_TYPE_LABELS[account.type]}</p>
              </div>
              <span className="text-sm font-medium tabular-nums text-foreground">
                {formatCurrency(account.opening_balance, account.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
