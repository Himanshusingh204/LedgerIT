import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatters/currency";

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function KpiCard({
  label,
  value,
  previousValue,
  tone = "neutral",
}: {
  label: string;
  value: number;
  previousValue: number;
  tone?: "positive" | "negative" | "neutral";
}) {
  const change = percentChange(value, previousValue);
  const isUp = change !== null && change >= 0;
  // For an expense tile, spending less is the favorable direction — invert the usual "up is good" read.
  const isFavorable = change !== null && (tone === "negative" ? change <= 0 : change >= 0);
  const toneClass = tone === "positive" ? "text-success" : tone === "negative" ? "text-danger" : "text-foreground";

  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-5">
      <p className="text-sm text-foreground-muted">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${toneClass}`}>{formatCurrency(value)}</p>
      {change !== null ? (
        <p className={`mt-1 flex items-center gap-1 text-xs ${isFavorable ? "text-success" : "text-danger"}`}>
          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(change).toFixed(1)}% vs previous period
        </p>
      ) : (
        <p className="mt-1 text-xs text-foreground-muted">No data for previous period</p>
      )}
    </div>
  );
}
