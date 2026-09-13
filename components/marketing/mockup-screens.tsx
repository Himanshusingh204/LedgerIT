import { ArrowDownRight, ArrowUpRight, Home, ShoppingBag, UtensilsCrossed, Car } from "lucide-react";

/**
 * Original, hand-built mockups of the real design system (docs/03) used in the
 * home-page carousel. Not photographs and not a competitor's UI — the actual
 * app screens don't exist yet, so these previews are honest approximations
 * built from the same tokens the real dashboard will use.
 */

function MockupChrome({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-[var(--radius-surface-lg)] border border-border bg-surface shadow-[0_1px_2px_rgba(18,25,43,0.04),0_16px_40px_-24px_rgba(18,25,43,0.35)]">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-3 text-xs font-medium text-foreground-muted">{label}</span>
      </div>
      <div className="h-[calc(100%-2.5rem)] p-4 sm:p-6">{children}</div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <MockupChrome label="Dashboard">
      <div className="grid h-full grid-cols-3 gap-3 sm:gap-4">
        <div className="col-span-3 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Spent this month", value: "$2,148.30", trend: "-4.2%", down: true },
            { label: "Income", value: "$3,200.00", trend: "+2.1%", down: false },
            { label: "Net change", value: "$1,051.70", trend: "+18.6%", down: false },
          ].map((m) => (
            <div key={m.label} className="rounded-[var(--radius-surface)] border border-border bg-surface p-3 sm:p-4">
              <p className="text-[11px] text-foreground-muted sm:text-xs">{m.label}</p>
              <p className="mt-1 text-sm font-semibold text-foreground sm:text-lg">{m.value}</p>
              <p
                className={`mt-1 flex items-center gap-0.5 text-[11px] font-medium ${m.down ? "text-success" : "text-success"}`}
              >
                {m.down ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                {m.trend}
              </p>
            </div>
          ))}
        </div>
        <div className="col-span-2 rounded-[var(--radius-surface)] border border-border bg-surface p-3 sm:p-4">
          <p className="text-[11px] font-medium text-foreground-muted sm:text-xs">Spending trend</p>
          <svg viewBox="0 0 240 80" className="mt-2 h-16 w-full sm:h-20">
            <polyline
              fill="none"
              stroke="var(--color-chart-1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,60 30,52 60,58 90,34 120,40 150,20 180,28 210,14 240,22"
            />
          </svg>
        </div>
        <div className="col-span-1 rounded-[var(--radius-surface)] border border-border bg-surface p-3 sm:p-4">
          <p className="text-[11px] font-medium text-foreground-muted sm:text-xs">By category</p>
          <div className="mt-3 space-y-2">
            {[
              { c: "var(--color-chart-1)", w: "70%" },
              { c: "var(--color-chart-2)", w: "45%" },
              { c: "var(--color-chart-3)", w: "30%" },
            ].map((b, i) => (
              <div key={i} className="h-1.5 rounded-full bg-surface-muted">
                <div className="h-1.5 rounded-full" style={{ width: b.w, background: b.c }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockupChrome>
  );
}

export function TransactionMockup() {
  const rows = [
    { icon: UtensilsCrossed, name: "Grocery Market", meta: "Food & Dining · Today", amount: "-$64.50" },
    { icon: Car, name: "Metro", meta: "Transport · Yesterday", amount: "-$12.00" },
    { icon: Home, name: "Skyline Apartments", meta: "Housing · Mar 3", amount: "-$1,100.00" },
    { icon: ShoppingBag, name: "Corner Cafe", meta: "Food & Dining · Mar 2", amount: "-$9.75" },
  ];

  return (
    <MockupChrome label="Add transaction">
      <div className="flex h-full flex-col gap-3">
        <div className="rounded-[var(--radius-surface)] border border-primary/20 bg-primary/5 p-3 sm:p-4">
          <p className="text-[11px] font-medium text-foreground-muted sm:text-xs">Amount</p>
          <p className="text-xl font-semibold text-foreground sm:text-2xl">$18.40</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
              Expense
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-foreground-muted">
              Income
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          {rows.map((r) => (
            <div key={r.name} className="flex items-center gap-3 rounded-[var(--radius-surface)] border border-border bg-surface p-2.5">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-surface-muted text-foreground-muted">
                <r.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{r.name}</span>
                <span className="block truncate text-[11px] text-foreground-muted">{r.meta}</span>
              </span>
              <span className="flex-none text-sm font-medium text-foreground">{r.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </MockupChrome>
  );
}

export function BudgetMockup() {
  const budgets = [
    { name: "Food & Dining", spent: 268, total: 400, color: "var(--color-chart-1)" },
    { name: "Transport", spent: 92, total: 80, color: "var(--color-danger)" },
    { name: "Entertainment", spent: 40, total: 100, color: "var(--color-chart-2)" },
  ];

  return (
    <MockupChrome label="Budgets · March">
      <div className="space-y-4">
        {budgets.map((b) => {
          const pct = Math.min(100, Math.round((b.spent / b.total) * 100));
          const over = b.spent > b.total;
          return (
            <div key={b.name} className="rounded-[var(--radius-surface)] border border-border bg-surface p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{b.name}</p>
                <p className={`text-xs font-medium ${over ? "text-danger" : "text-foreground-muted"}`}>
                  ${b.spent} / ${b.total}
                </p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-surface-muted">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${pct}%`, background: over ? "var(--color-danger)" : b.color }}
                />
              </div>
              {over && <p className="mt-1.5 text-[11px] font-medium text-danger">Over budget this month</p>}
            </div>
          );
        })}
      </div>
    </MockupChrome>
  );
}

export function AnalyticsMockup() {
  const bars = [40, 65, 30, 80, 55, 70, 45];
  return (
    <MockupChrome label="Analytics">
      <div className="flex h-full flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-3 sm:p-4">
            <p className="text-[11px] text-foreground-muted sm:text-xs">Top merchant</p>
            <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">Grocery Market</p>
          </div>
          <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-3 sm:p-4">
            <p className="text-[11px] text-foreground-muted sm:text-xs">Vs. last month</p>
            <p className="mt-1 text-sm font-semibold text-success sm:text-base">-8.3% spending</p>
          </div>
        </div>
        <div className="flex-1 rounded-[var(--radius-surface)] border border-border bg-surface p-3 sm:p-4">
          <p className="text-[11px] font-medium text-foreground-muted sm:text-xs">Weekly spend</p>
          <div className="mt-4 flex h-24 items-end gap-2 sm:h-28">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-primary/70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </MockupChrome>
  );
}
