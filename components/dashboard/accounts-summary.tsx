import Link from "next/link";
import { Wallet } from "lucide-react";
import type { Account } from "@/types/database";
import type { AccountWithBalance } from "@/lib/data/accounts";
import { formatCurrency } from "@/lib/formatters/currency";

const ACCOUNT_TYPE_LABELS: Record<Account["type"], string> = {
  cash: "Cash",
  bank: "Bank account",
  debit_card: "Debit card",
  credit_card: "Credit card",
  other: "Other",
};

export function AccountsSummary({ accounts }: { accounts: AccountWithBalance[] }) {
  return (
    <div className="card-surface p-5">
      <h2 className="label-caps text-foreground-muted">Accounts</h2>

      {accounts.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
          <Wallet className="h-6 w-6 text-foreground-muted" aria-hidden />
          <p className="text-sm text-foreground-muted">No accounts yet.</p>
          <Link href="/settings" className="text-sm font-medium text-primary hover:underline">
            Add an account
          </Link>
        </div>
      ) : (
        <ul className="mt-3 space-y-1">
          {accounts.map((account) => (
            <li key={account.id} className="flex items-center gap-3 rounded-lg px-1 py-2 hover:bg-surface-muted/60">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-surface-muted text-foreground-muted">
                <Wallet className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{account.name}</p>
                <p className="label-caps text-foreground-muted">{ACCOUNT_TYPE_LABELS[account.type]}</p>
              </div>
              <span className="text-num text-sm font-medium text-foreground">
                {formatCurrency(account.balance, account.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
