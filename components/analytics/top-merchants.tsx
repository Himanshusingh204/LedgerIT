import { Store } from "lucide-react";
import type { MerchantSpend } from "@/lib/finance/calculations";
import { formatCurrency } from "@/lib/formatters/currency";

export function TopMerchants({ merchants }: { merchants: MerchantSpend[] }) {
  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-5">
      <h2 className="text-sm font-medium text-foreground-muted">Top merchants</h2>

      {merchants.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-6 text-center">
          <Store className="h-6 w-6 text-foreground-muted" aria-hidden />
          <p className="text-sm text-foreground-muted">No merchant spending yet this period.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {merchants.map((entry) => (
            <li key={entry.merchant} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-foreground">{entry.merchant}</span>
              <span className="text-sm font-medium tabular-nums text-foreground">{formatCurrency(entry.total)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
