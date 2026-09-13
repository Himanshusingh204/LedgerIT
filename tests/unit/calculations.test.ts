import { describe, expect, it } from "vitest";
import {
  calculateNetChange,
  calculateCategorySpend,
  calculateBudgetProgress,
  calculateDailyTrend,
  calculateTopMerchants,
} from "@/lib/finance/calculations";
import type { Transaction } from "@/types/database";

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: crypto.randomUUID(),
    user_id: "user-1",
    account_id: "account-1",
    category_id: "category-1",
    type: "expense",
    amount: 0,
    currency: "USD",
    merchant: null,
    note: null,
    receipt_url: null,
    occurred_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("calculateNetChange", () => {
  it("sums expenses and income separately", () => {
    const transactions = [
      tx({ type: "expense", amount: 50 }),
      tx({ type: "expense", amount: 25.5 }),
      tx({ type: "income", amount: 1000 }),
    ];

    const result = calculateNetChange(transactions);

    expect(result.expenseTotal).toBe(75.5);
    expect(result.incomeTotal).toBe(1000);
    expect(result.netChange).toBe(924.5);
  });

  it("excludes transfers from expense and income totals", () => {
    const transactions = [tx({ type: "transfer", amount: 500 }), tx({ type: "expense", amount: 20 })];

    const result = calculateNetChange(transactions);

    expect(result.expenseTotal).toBe(20);
    expect(result.incomeTotal).toBe(0);
    expect(result.netChange).toBe(-20);
  });

  it("returns zeroed totals for an empty period", () => {
    const result = calculateNetChange([]);
    expect(result).toEqual({ expenseTotal: 0, incomeTotal: 0, netChange: 0 });
  });
});

describe("calculateCategorySpend", () => {
  it("groups expense totals by category, sorted descending", () => {
    const transactions = [
      tx({ type: "expense", category_id: "food", amount: 30 }),
      tx({ type: "expense", category_id: "transport", amount: 90 }),
      tx({ type: "expense", category_id: "food", amount: 20 }),
      tx({ type: "income", category_id: "food", amount: 500 }),
    ];

    const result = calculateCategorySpend(transactions);

    expect(result).toEqual([
      { categoryId: "transport", total: 90 },
      { categoryId: "food", total: 50 },
    ]);
  });

  it("ignores expenses without a category", () => {
    const result = calculateCategorySpend([tx({ type: "expense", category_id: null, amount: 40 })]);
    expect(result).toEqual([]);
  });
});

describe("calculateBudgetProgress", () => {
  it("computes remaining and progress under budget", () => {
    const result = calculateBudgetProgress(200, 120);
    expect(result.remaining).toBe(80);
    expect(result.progress).toBeCloseTo(0.6);
    expect(result.isOverBudget).toBe(false);
  });

  it("flags over-budget spend", () => {
    const result = calculateBudgetProgress(100, 150);
    expect(result.remaining).toBe(-50);
    expect(result.isOverBudget).toBe(true);
  });

  it("does not divide by zero for a zero-amount budget", () => {
    const result = calculateBudgetProgress(0, 0);
    expect(result.progress).toBe(0);
    expect(result.isOverBudget).toBe(false);
  });
});

describe("calculateDailyTrend", () => {
  it("buckets transactions by calendar day and excludes transfers", () => {
    const result = calculateDailyTrend([
      tx({ type: "expense", amount: 10, occurred_at: "2026-01-05T08:00:00.000Z" }),
      tx({ type: "expense", amount: 5, occurred_at: "2026-01-05T20:00:00.000Z" }),
      tx({ type: "income", amount: 100, occurred_at: "2026-01-06T00:00:00.000Z" }),
      tx({ type: "transfer", amount: 999, occurred_at: "2026-01-06T00:00:00.000Z" }),
    ]);

    expect(result).toEqual([
      { date: "2026-01-05", expenseTotal: 15, incomeTotal: 0 },
      { date: "2026-01-06", expenseTotal: 0, incomeTotal: 100 },
    ]);
  });
});

describe("calculateTopMerchants", () => {
  it("sums expense amounts by merchant, sorted descending, limited", () => {
    const result = calculateTopMerchants(
      [
        tx({ type: "expense", merchant: "Coffee Shop", amount: 5 }),
        tx({ type: "expense", merchant: "Coffee Shop", amount: 4 }),
        tx({ type: "expense", merchant: "Grocery Store", amount: 60 }),
        tx({ type: "income", merchant: "Employer", amount: 1000 }),
        tx({ type: "expense", merchant: null, amount: 20 }),
      ],
      1,
    );

    expect(result).toEqual([{ merchant: "Grocery Store", total: 60 }]);
  });
});
