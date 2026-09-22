"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Category } from "@/types/database";
import type { CategorySpend } from "@/lib/finance/calculations";
import { formatCurrency } from "@/lib/formatters/currency";
import { CategoryIcon } from "@/components/shared/category-icon";

const BAR_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];
const OTHER_COLOR = "var(--foreground-muted)";
const TOP_N = 3;

export function CategorySpendChart({
  categorySpend,
  categories,
}: {
  categorySpend: CategorySpend[];
  categories: Category[];
}) {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  const top = categorySpend.slice(0, TOP_N).map((entry, index) => ({
    name: categoriesById.get(entry.categoryId)?.name ?? "Uncategorized",
    icon: categoriesById.get(entry.categoryId)?.icon ?? "circle",
    total: entry.total,
    color: BAR_COLORS[index],
  }));

  const otherTotal = categorySpend.slice(TOP_N).reduce((sum, entry) => sum + entry.total, 0);
  const data = otherTotal > 0 ? [...top, { name: "Other", icon: "circle-ellipsis", total: otherTotal, color: OTHER_COLOR }] : top;

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[var(--radius-surface)] border border-dashed border-border text-sm text-foreground-muted">
        No spending yet this period.
      </div>
    );
  }

  return (
    <div className="card-surface p-5">
      <h2 className="label-caps text-foreground-muted">Spending by category</h2>

      {/* Screen-reader-only data table — the chart below is an SVG with no accessible text
          equivalent for its bar values (the legend only names categories, not amounts). */}
      <table className="sr-only">
        <caption>Spending by category</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.name}>
              <th scope="row">{entry.name}</th>
              <td>{formatCurrency(entry.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3" aria-hidden style={{ height: Math.max(160, data.length * 44) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-muted)" }}
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "var(--radius-control)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
              <LabelList
                dataKey="total"
                position="right"
                formatter={(value) => formatCurrency(Number(value))}
                style={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground-muted">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center gap-1.5">
            <CategoryIcon icon={entry.icon} className="h-3 w-3" />
            {entry.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
