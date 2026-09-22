import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { getDashboardSnapshot } from "@/lib/data/dashboard";
import { listCategories } from "@/lib/data/categories";
import type { RangeKey } from "@/lib/finance/date-range";
import { RangeSelector } from "@/components/dashboard/range-selector";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { BudgetMeter } from "@/components/dashboard/budget-meter";
import { CategorySpendChart } from "@/components/dashboard/category-spend-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AccountsSummary } from "@/components/dashboard/accounts-summary";

export const metadata: Metadata = {
  title: "Dashboard",
};

const RANGE_KEYS = new Set<RangeKey>(["week", "month", "quarter", "year"]);

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">Your session expired. Please sign in again.</p>
      </div>
    );
  }

  const rangeParam = typeof params.range === "string" ? params.range : "month";
  const range: RangeKey = RANGE_KEYS.has(rangeParam as RangeKey) ? (rangeParam as RangeKey) : "month";

  let snapshot: Awaited<ReturnType<typeof getDashboardSnapshot>> | null = null;
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let loadError = false;

  try {
    const profile = await getProfile(supabase, user.id);
    [snapshot, categories] = await Promise.all([
      getDashboardSnapshot(supabase, user.id, profile.timezone, range),
      listCategories(supabase),
    ]);
  } catch {
    loadError = true;
  }

  if (loadError || !snapshot) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">
          Something went wrong loading your dashboard. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label-caps text-foreground-muted">Overview</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        </div>
        <RangeSelector current={range} />
      </div>

      {snapshot.isTruncated ? (
        <p role="alert" className="mt-4 rounded-[var(--radius-control)] bg-danger/10 px-3 py-2 text-sm text-danger">
          This period has more transactions than can be shown at once — totals and charts below
          reflect only part of it. Try a narrower date range for exact numbers.
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Income"
          value={snapshot.totals.incomeTotal}
          previousValue={snapshot.previousTotals.incomeTotal}
          tone="positive"
          trend={snapshot.dailyTrend.map((point) => point.incomeTotal)}
        />
        <KpiCard
          label="Expenses"
          value={snapshot.totals.expenseTotal}
          previousValue={snapshot.previousTotals.expenseTotal}
          tone="negative"
          trend={snapshot.dailyTrend.map((point) => point.expenseTotal)}
        />
        <KpiCard label="Net change" value={snapshot.totals.netChange} previousValue={snapshot.previousTotals.netChange} />
        <BudgetMeter progress={snapshot.monthlyBudget} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CategorySpendChart categorySpend={snapshot.categorySpend} categories={categories} />
        </div>
        <AccountsSummary accounts={snapshot.accounts} />
      </div>

      <div className="mt-4">
        <RecentTransactions
          transactions={snapshot.recentTransactions}
          categories={categories}
          accounts={snapshot.accounts}
        />
      </div>
    </div>
  );
}
