import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Transaction } from "@/types/database";
import { listTransactionsInRange } from "@/lib/data/transactions";
import { listAccountsWithBalances } from "@/lib/data/accounts";
import { listBudgetsForMonth } from "@/lib/data/budgets";
import {
  calculateBudgetProgress,
  calculateCategorySpend,
  calculateDailyTrend,
  calculateNetChange,
} from "@/lib/finance/calculations";
import { buildDateRange, calculatePreviousPeriod, monthStartISO, type RangeKey } from "@/lib/finance/date-range";

export interface DashboardSnapshot {
  totals: ReturnType<typeof calculateNetChange>;
  previousTotals: ReturnType<typeof calculateNetChange>;
  categorySpend: ReturnType<typeof calculateCategorySpend>;
  recentTransactions: Transaction[];
  accounts: Awaited<ReturnType<typeof listAccountsWithBalances>>;
  /** Daily expense/income totals for the current period, oldest first — feeds the KPI sparklines. */
  dailyTrend: ReturnType<typeof calculateDailyTrend>;
  /** Always "this calendar month," independent of the range selector — matches how the Budgets page defines a month. */
  monthlyBudget: ReturnType<typeof calculateBudgetProgress>;
  /** True if the selected range has more transactions than were fetched — totals above are partial. */
  isTruncated: boolean;
}

export async function getDashboardSnapshot(
  supabase: SupabaseClient<Database>,
  userId: string,
  timezone: string,
  range: RangeKey = "month",
): Promise<DashboardSnapshot> {
  const currentRange = buildDateRange(range, timezone);
  const previousRange = calculatePreviousPeriod(currentRange);
  const monthKey = monthStartISO(new Date(), timezone);
  const isCurrentRangeThisMonth = range === "month";
  const thisMonthRange = isCurrentRangeThisMonth ? currentRange : buildDateRange("month", timezone);

  const [current, previous, accounts, monthlyBudgets, thisMonth] = await Promise.all([
    listTransactionsInRange(supabase, userId, currentRange.start.toISOString(), currentRange.end.toISOString()),
    listTransactionsInRange(supabase, userId, previousRange.start.toISOString(), previousRange.end.toISOString()),
    listAccountsWithBalances(supabase, userId),
    listBudgetsForMonth(supabase, userId, monthKey),
    isCurrentRangeThisMonth
      ? Promise.resolve(null)
      : listTransactionsInRange(supabase, userId, thisMonthRange.start.toISOString(), thisMonthRange.end.toISOString()),
  ]);

  const currentTransactions = current.transactions;
  const monthTransactions = thisMonth?.transactions ?? currentTransactions;
  const totalBudgeted = monthlyBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  const monthSpent = calculateNetChange(monthTransactions).expenseTotal;

  return {
    totals: calculateNetChange(currentTransactions),
    previousTotals: calculateNetChange(previous.transactions),
    categorySpend: calculateCategorySpend(currentTransactions),
    recentTransactions: currentTransactions
      .slice()
      .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
      .slice(0, 8),
    accounts,
    dailyTrend: calculateDailyTrend(currentTransactions),
    monthlyBudget: calculateBudgetProgress(totalBudgeted, monthSpent),
    isTruncated: current.isTruncated || (thisMonth?.isTruncated ?? false),
  };
}
