import type { Transaction } from "@/types/database";

export interface PeriodTotals {
  expenseTotal: number;
  incomeTotal: number;
  netChange: number;
}

/**
 * Transfers are excluded from spending/income totals — they move money between
 * the user's own accounts and are not economic activity (docs/02 §6).
 */
export function calculateNetChange(transactions: Transaction[]): PeriodTotals {
  let expenseTotal = 0;
  let incomeTotal = 0;

  for (const tx of transactions) {
    if (tx.type === "expense") expenseTotal += tx.amount;
    if (tx.type === "income") incomeTotal += tx.amount;
  }

  return {
    expenseTotal: roundCurrency(expenseTotal),
    incomeTotal: roundCurrency(incomeTotal),
    netChange: roundCurrency(incomeTotal - expenseTotal),
  };
}

export interface CategorySpend {
  categoryId: string;
  total: number;
}

export function calculateCategorySpend(transactions: Transaction[]): CategorySpend[] {
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== "expense" || !tx.category_id) continue;
    totals.set(tx.category_id, (totals.get(tx.category_id) ?? 0) + tx.amount);
  }

  return Array.from(totals.entries())
    .map(([categoryId, total]) => ({ categoryId, total: roundCurrency(total) }))
    .sort((a, b) => b.total - a.total);
}

export interface BudgetProgress {
  budgetAmount: number;
  spent: number;
  remaining: number;
  progress: number;
  isOverBudget: boolean;
}

export function calculateBudgetProgress(budgetAmount: number, spent: number): BudgetProgress {
  const remaining = roundCurrency(budgetAmount - spent);
  const progress = budgetAmount > 0 ? spent / budgetAmount : 0;

  return {
    budgetAmount: roundCurrency(budgetAmount),
    spent: roundCurrency(spent),
    remaining,
    progress,
    isOverBudget: spent > budgetAmount,
  };
}

export interface TrendPoint {
  date: string;
  expenseTotal: number;
  incomeTotal: number;
}

/** Buckets transactions by their local calendar day (YYYY-MM-DD), ascending. */
export function calculateDailyTrend(transactions: Transaction[]): TrendPoint[] {
  const totals = new Map<string, { expenseTotal: number; incomeTotal: number }>();

  for (const tx of transactions) {
    if (tx.type === "transfer") continue;
    const date = tx.occurred_at.slice(0, 10);
    const bucket = totals.get(date) ?? { expenseTotal: 0, incomeTotal: 0 };
    if (tx.type === "expense") bucket.expenseTotal += tx.amount;
    if (tx.type === "income") bucket.incomeTotal += tx.amount;
    totals.set(date, bucket);
  }

  return Array.from(totals.entries())
    .map(([date, bucket]) => ({
      date,
      expenseTotal: roundCurrency(bucket.expenseTotal),
      incomeTotal: roundCurrency(bucket.incomeTotal),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface MerchantSpend {
  merchant: string;
  total: number;
}

export function calculateTopMerchants(transactions: Transaction[], limit = 5): MerchantSpend[] {
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== "expense" || !tx.merchant) continue;
    totals.set(tx.merchant, (totals.get(tx.merchant) ?? 0) + tx.amount);
  }

  return Array.from(totals.entries())
    .map(([merchant, total]) => ({ merchant, total: roundCurrency(total) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

/**
 * Running balance = opening balance + income − expenses, for transactions posted to this account.
 * Transfers are excluded, same as `calculateNetChange`/`calculateDailyTrend` — the `transactions`
 * table has no destination account or in/out direction for a `transfer` row, just one `account_id`
 * and an always-positive `amount`, so a transfer can't be resolved to money in or out of the
 * account it's posted against without a schema change. Until one exists, a transfer won't move the
 * balance shown on screen (see TASKS.md's Phase 4 entry for the full reasoning).
 */
export function calculateAccountBalance(
  openingBalance: number,
  transactions: Pick<Transaction, "type" | "amount">[],
): number {
  let balance = openingBalance;

  for (const tx of transactions) {
    if (tx.type === "income") balance += tx.amount;
    if (tx.type === "expense") balance -= tx.amount;
  }

  return roundCurrency(balance);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
