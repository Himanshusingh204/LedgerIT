import type { Metadata } from "next";
import { Tags, ShieldAlert, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAdminSystemCategories } from "@/lib/data/admin";
import { CategoryIcon } from "@/components/shared/category-icon";
import { AdminPageTransition } from "@/components/admin/admin-page-transition";

export const metadata: Metadata = {
  title: "System Categories",
};

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const categories = await listAdminSystemCategories(supabase);

  const expenseCategories = categories.filter((c) => c.kind === "expense");
  const incomeCategories = categories.filter((c) => c.kind === "income");

  return (
    <AdminPageTransition className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            System Categories & Taxonomy
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Inspect default platform categories available to all registered users (`user_id is null`).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground">
            {categories.length} System Presets
          </span>
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-muted/30 p-4 text-xs text-foreground-muted">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="leading-relaxed">
          System categories are defined in migration <code className="font-mono text-foreground">0002_default_categories.sql</code>.
          They are read-only for standard users and serve as the baseline taxonomy for transactions and budgets across the entire platform.
        </p>
      </div>

      {/* Expense Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
            <ArrowDownRight className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">
            Expense Presets ({expenseCategories.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {expenseCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:border-border-focus"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-foreground">
                <CategoryIcon icon={cat.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{cat.name}</p>
                <p className="font-mono text-[10px] text-foreground-muted">{cat.slug}</p>
              </div>
              <span className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase text-rose-400">
                Expense
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Income Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">
            Income Presets ({incomeCategories.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {incomeCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:border-border-focus"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-foreground">
                <CategoryIcon icon={cat.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{cat.name}</p>
                <p className="font-mono text-[10px] text-foreground-muted">{cat.slug}</p>
              </div>
              <span className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-400">
                Income
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminPageTransition>
  );
}
