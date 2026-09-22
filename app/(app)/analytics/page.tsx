import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { listCategories } from "@/lib/data/categories";
import { listTransactionsInRange } from "@/lib/data/transactions";
import { buildDateRange, calculatePreviousPeriod, type RangeKey } from "@/lib/finance/date-range";
import {
  calculateCategorySpend,
  calculateDailyTrend,
  calculateNetChange,
  calculateTopMerchants,
} from "@/lib/finance/calculations";
import { RangeSelector } from "@/components/dashboard/range-selector";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CategorySpendChart } from "@/components/dashboard/category-spend-chart";
import { TrendChart } from "@/components/analytics/trend-chart";
import { TopMerchants } from "@/components/analytics/top-merchants";

export const metadata: Metadata = {
  title: "Analytics",
};

const RANGE_KEYS = new Set<RangeKey>(["week", "month", "quarter", "year"]);

export default async function AnalyticsPage({ searchParams }: PageProps<"/analytics">) {
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

  let loadError = false;
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let totals = calculateNetChange([]);
  let previousTotals = calculateNetChange([]);
  let categorySpend = calculateCategorySpend([]);
  let trend = calculateDailyTrend([]);
  let topMerchants = calculateTopMerchants([]);
  let isTruncated = false;

  try {
    const profile = await getProfile(supabase, user.id);
    const currentRange = buildDateRange(range, profile.timezone);
    const previousRange = calculatePreviousPeriod(currentRange);

    const [current, previous, categoryList] = await Promise.all([
      listTransactionsInRange(supabase, user.id, currentRange.start.toISOString(), currentRange.end.toISOString()),
      listTransactionsInRange(supabase, user.id, previousRange.start.toISOString(), previousRange.end.toISOString()),
      listCategories(supabase),
    ]);

    categories = categoryList;
    totals = calculateNetChange(current.transactions);
    previousTotals = calculateNetChange(previous.transactions);
    categorySpend = calculateCategorySpend(current.transactions);
    trend = calculateDailyTrend(current.transactions);
    topMerchants = calculateTopMerchants(current.transactions);
    isTruncated = current.isTruncated;
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">
          Something went wrong loading your analytics. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <RangeSelector current={range} />
      </div>

      {isTruncated ? (
        <p role="alert" className="mt-4 rounded-[var(--radius-control)] bg-danger/10 px-3 py-2 text-sm text-danger">
          This period has more transactions than can be shown at once — totals and charts below
          reflect only part of it. Try a narrower date range for exact numbers.
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Income" value={totals.incomeTotal} previousValue={previousTotals.incomeTotal} tone="positive" />
        <KpiCard label="Expenses" value={totals.expenseTotal} previousValue={previousTotals.expenseTotal} tone="negative" />
        <KpiCard label="Net change" value={totals.netChange} previousValue={previousTotals.netChange} />
      </div>

      <div className="mt-4">
        <TrendChart trend={trend} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategorySpendChart categorySpend={categorySpend} categories={categories} />
        <TopMerchants merchants={topMerchants} />
      </div>
    </div>
  );
}
