import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { listTransactionsInRange } from "@/lib/data/transactions";
import { listAccounts } from "@/lib/data/accounts";
import { calculateCategorySpend, calculateNetChange } from "@/lib/finance/calculations";
import { buildDateRange, calculatePreviousPeriod, type RangeKey } from "@/lib/finance/date-range";

export interface DashboardSnapshot {
  totals: ReturnType<typeof calculateNetChange>;
  previousTotals: ReturnType<typeof calculateNetChange>;
  categorySpend: ReturnType<typeof calculateCategorySpend>;
  recentTransactions: Awaited<ReturnType<typeof listTransactionsInRange>>;
  accounts: Awaited<ReturnType<typeof listAccounts>>;
}

export async function getDashboardSnapshot(
  supabase: SupabaseClient<Database>,
  userId: string,
  timezone: string,
  range: RangeKey = "month",
): Promise<DashboardSnapshot> {
  const currentRange = buildDateRange(range, timezone);
  const previousRange = calculatePreviousPeriod(currentRange);

  const [currentTransactions, previousTransactions, accounts] = await Promise.all([
    listTransactionsInRange(supabase, userId, currentRange.start.toISOString(), currentRange.end.toISOString()),
    listTransactionsInRange(supabase, userId, previousRange.start.toISOString(), previousRange.end.toISOString()),
    listAccounts(supabase, userId),
  ]);

  return {
    totals: calculateNetChange(currentTransactions),
    previousTotals: calculateNetChange(previousTransactions),
    categorySpend: calculateCategorySpend(currentTransactions),
    recentTransactions: currentTransactions
      .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
      .slice(0, 8),
    accounts,
  };
}
