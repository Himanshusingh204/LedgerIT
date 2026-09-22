import Link from "next/link";
import type { BudgetProgress } from "@/lib/finance/calculations";
import { formatCurrency } from "@/lib/formatters/currency";

/** A same-ramp-track meter for "a single ratio against a limit" — see the dataviz skill's form guide. */
export function BudgetMeter({ progress }: { progress: BudgetProgress }) {
  if (progress.budgetAmount === 0) {
    return (
      <Link
        href="/budgets"
        className="card-surface flex flex-col justify-between border border-dashed border-border p-5 transition-colors hover:bg-surface-muted"
      >
        <p className="label-caps text-foreground-muted">This month&apos;s budget</p>
        <p className="mt-2 text-sm text-foreground-muted">No budgets set for this month yet.</p>
        <p className="mt-2 text-xs font-medium text-primary">Set a budget →</p>
      </Link>
    );
  }

  const trackFillPercent = Math.min(progress.progress, 1) * 100;
  const trackColor = progress.isOverBudget ? "bg-danger" : "bg-primary";

  return (
    <div className="card-surface flex flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="label-caps text-foreground-muted">This month&apos;s budget</p>
        <span className="label-caps rounded-lg bg-surface-muted px-2 py-0.5 text-foreground-muted">
          {Math.round(progress.progress * 100)}% used
        </span>
      </div>
      <p className="text-num mt-2 text-[2rem] leading-none font-medium text-foreground">{formatCurrency(progress.spent)}</p>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div className={`h-full rounded-full ${trackColor}`} style={{ width: `${trackFillPercent}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-num text-xs text-foreground-muted">{formatCurrency(progress.budgetAmount)} cap</span>
          <span className={`text-num text-xs font-medium ${progress.isOverBudget ? "text-danger" : "text-success"}`}>
            {progress.isOverBudget
              ? `${formatCurrency(Math.abs(progress.remaining))} over`
              : `${formatCurrency(progress.remaining)} left`}
          </span>
        </div>
      </div>
    </div>
  );
}
