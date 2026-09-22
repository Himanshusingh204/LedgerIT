"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/lib/finance/calculations";
import { formatCurrency } from "@/lib/formatters/currency";

function formatDateLabel(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function TrendChart({ trend }: { trend: TrendPoint[] }) {
  if (trend.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[var(--radius-surface)] border border-dashed border-border text-sm text-foreground-muted">
        No activity yet this period.
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-5">
      <h2 className="text-sm font-medium text-foreground-muted">Spending over time</h2>

      {/* Screen-reader-only data table — the SVG chart below has no accessible text equivalent. */}
      <table className="sr-only">
        <caption>Income and expenses by day</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Income</th>
            <th scope="col">Expenses</th>
          </tr>
        </thead>
        <tbody>
          {trend.map((point) => (
            <tr key={point.date}>
              <th scope="row">{formatDateLabel(point.date)}</th>
              <td>{formatCurrency(point.incomeTotal)}</td>
              <td>{formatCurrency(point.expenseTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 h-64" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              tick={{ fill: "var(--foreground-muted)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(Number(value))}
              tick={{ fill: "var(--foreground-muted)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <Tooltip
              labelFormatter={(label) => formatDateLabel(String(label))}
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "var(--radius-control)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "var(--foreground-muted)" }} />
            <Line
              type="monotone"
              dataKey="incomeTotal"
              name="Income"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenseTotal"
              name="Expenses"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
