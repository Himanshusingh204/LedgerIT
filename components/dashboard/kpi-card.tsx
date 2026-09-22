import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatters/currency";
import { Sparkline } from "@/components/dashboard/sparkline";

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function KpiCard({
  label,
  value,
  previousValue,
  tone = "neutral",
  trend,
}: {
  label: string;
  value: number;
  previousValue: number;
  tone?: "positive" | "negative" | "neutral";
  /** Daily values for the current period, oldest first — renders as a trend sparkline. */
  trend?: number[];
}) {
  const change = percentChange(value, previousValue);
  const isUp = change !== null && change >= 0;
  // For an expense tile, spending less is the favorable direction — invert the usual "up is good" read.
  const isFavorable = change !== null && (tone === "negative" ? change <= 0 : change >= 0);
  const toneClass = tone === "positive" ? "text-success" : tone === "negative" ? "text-danger" : "text-foreground";
  const sparklineClass = tone === "positive" ? "text-success" : tone === "negative" ? "text-danger" : "text-primary";
  const pillClass = isFavorable ? "bg-success/10 text-success" : "bg-danger/10 text-danger";

  return (
    <div className="card-surface flex flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-caps text-foreground-muted">{label}</p>
          <p className={`text-num mt-2 text-[2rem] leading-none font-medium ${toneClass}`}>{formatCurrency(value)}</p>
        </div>
        {change !== null ? (
          <span className={`flex items-center gap-1 rounded-lg px-2 py-0.5 ${pillClass}`}>
            {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            <span className="text-num text-xs font-medium">{Math.abs(change).toFixed(1)}%</span>
          </span>
        ) : null}
      </div>
      {trend && trend.length >= 2 ? (
        <div className="mt-3 flex items-end justify-between pt-1">
          <Sparkline values={trend} className={sparklineClass} />
          <span className="text-num text-xs text-foreground-muted">vs {formatCurrency(previousValue)} prev</span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-foreground-muted">No data for previous period</p>
      )}
    </div>
  );
}
