import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatters/currency";
import { Sparkline } from "@/components/dashboard/sparkline";

// A previous period under $1 gives meaningless percentages (e.g. +4455%), so show no comparison.
function percentChange(current: number, previous: number): number | null {
  if (Math.abs(previous) < 1) return null;
  const change = ((current - previous) / Math.abs(previous)) * 100;
  // Beyond ±999% the comparison is noise (tiny baseline), so show no badge rather than a fake number.
  return Math.abs(change) > 999 ? null : change;
}

export function KpiCard({
  label,
  value,
  previousValue,
  tone = "neutral",
  trend,
  currency,
}: {
  currency: string;
  label: string;
  value: number;
  previousValue: number;
  tone?: "positive" | "negative" | "neutral";
  /** Daily values for the current period, oldest first, renders as a trend sparkline. */
  trend?: number[];
}) {
  const change = percentChange(value, previousValue);
  const isUp = change !== null && change >= 0;
  // For an expense tile, spending less is the favorable direction, invert the usual "up is good" read.
  const isFavorable = change !== null && (tone === "negative" ? change <= 0 : change >= 0);
  const toneClass = tone === "positive" ? "text-success" : tone === "negative" ? "text-danger" : "text-foreground";
  const sparklineClass = tone === "positive" ? "text-success" : tone === "negative" ? "text-danger" : "text-primary";
  const pillClass = isFavorable ? "bg-success/10 text-success" : "bg-danger/10 text-danger";

  return (
    <div className="card-surface flex flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-caps text-foreground-muted">{label}</p>
          <p className={`text-num mt-2 text-[2rem] leading-none font-medium ${toneClass}`}>{formatCurrency(value, currency)}</p>
        </div>
        {change !== null ? (
          <span className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2 py-0.5 ${pillClass}`}>
            {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            <span className="text-num text-xs font-medium">{Math.abs(change).toFixed(1)}%</span>
          </span>
        ) : null}
      </div>
      {trend && trend.length >= 2 ? (
        <div className="mt-3 flex items-end justify-between pt-1">
          <Sparkline values={trend} className={sparklineClass} />
          <span className="text-num text-xs text-foreground-muted">vs {formatCurrency(previousValue, currency)} prev</span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-foreground-muted">No data for previous period</p>
      )}
    </div>
  );
}
