import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { getDashboardSnapshot } from "@/lib/data/dashboard";
import { listCategories } from "@/lib/data/categories";
import type { RangeKey } from "@/lib/finance/date-range";
import { RangeSelector } from "@/components/dashboard/range-selector";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CategorySpendChart } from "@/components/dashboard/category-spend-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AccountsSummary } from "@/components/dashboard/accounts-summary";

export const metadata: Metadata = {
  title: "Dashboard",
};

const RANGE_KEYS = new Set<RangeKey>(["week", "month", "quarter", "year"]);

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
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
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <RangeSelector current={range} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Income" value={snapshot.totals.incomeTotal} previousValue={snapshot.previousTotals.incomeTotal} tone="positive" />
        <KpiCard label="Expenses" value={snapshot.totals.expenseTotal} previousValue={snapshot.previousTotals.expenseTotal} tone="negative" />
        <KpiCard label="Net change" value={snapshot.totals.netChange} previousValue={snapshot.previousTotals.netChange} />
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
