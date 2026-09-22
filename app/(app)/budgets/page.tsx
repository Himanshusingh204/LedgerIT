import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { listCategories } from "@/lib/data/categories";
import { listBudgetsForMonth } from "@/lib/data/budgets";
import { listTransactionsInRange } from "@/lib/data/transactions";
import { buildDateRange, monthStartISO } from "@/lib/finance/date-range";
import { calculateBudgetProgress, calculateCategorySpend } from "@/lib/finance/calculations";
import { MonthSelector } from "@/components/budgets/month-selector";
import { BudgetRow } from "@/components/budgets/budget-row";

export const metadata: Metadata = {
  title: "Budgets",
};

function isValidMonthParam(value: string): boolean {
  return /^\d{4}-\d{2}-01$/.test(value);
}

interface BudgetsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">Your session expired. Please sign in again.</p>
      </div>
    );
  }

  let loadError = false;
  let monthStart = "";
  let expenseCategories: Awaited<ReturnType<typeof listCategories>> = [];
  let budgetByCategoryId = new Map<string, { id: string; amount: number }>();
  let spentByCategoryId = new Map<string, number>();
  let isTruncated = false;

  try {
    const profile = await getProfile(supabase, user.id);
    const monthParam = typeof params.month === "string" ? params.month : "";
    monthStart = isValidMonthParam(monthParam) ? monthParam : monthStartISO(new Date(), profile.timezone);

    const monthRange = buildDateRange("month", profile.timezone, new Date(`${monthStart}T12:00:00Z`));

    const [categories, budgets, transactionsResult] = await Promise.all([
      listCategories(supabase),
      listBudgetsForMonth(supabase, user.id, monthStart),
      listTransactionsInRange(supabase, user.id, monthRange.start.toISOString(), monthRange.end.toISOString()),
    ]);

    expenseCategories = categories.filter((category) => category.kind === "expense");
    budgetByCategoryId = new Map(budgets.map((budget) => [budget.category_id, { id: budget.id, amount: budget.amount }]));
    const spend = calculateCategorySpend(transactionsResult.transactions);
    spentByCategoryId = new Map(spend.map((entry) => [entry.categoryId, entry.total]));
    isTruncated = transactionsResult.isTruncated;
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">
          Something went wrong loading your budgets. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Budgets</h1>
        <MonthSelector monthStart={monthStart} />
      </div>
      <p className="mt-1 text-sm text-foreground-muted">
        Set a monthly limit per category and track how close you are to it.
      </p>

      {isTruncated ? (
        <p role="alert" className="mt-4 rounded-[var(--radius-control)] bg-danger/10 px-3 py-2 text-sm text-danger">
          This month has more transactions than can be shown at once — spent amounts below reflect
          only part of it.
        </p>
      ) : null}

      {expenseCategories.length === 0 ? (
        <p className="mt-6 text-sm text-foreground-muted">No expense categories available yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {expenseCategories.map((category) => {
            const budget = budgetByCategoryId.get(category.id);
            const spent = spentByCategoryId.get(category.id) ?? 0;
            return (
              <BudgetRow
                key={category.id}
                category={category}
                monthStart={monthStart}
                budgetId={budget?.id ?? null}
                progress={budget ? calculateBudgetProgress(budget.amount, spent) : null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
