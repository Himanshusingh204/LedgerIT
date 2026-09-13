"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types/database";
import type { BudgetProgress } from "@/lib/finance/calculations";
import { formatCurrency } from "@/lib/formatters/currency";
import { setBudgetAction, deleteBudgetAction, type BudgetActionState } from "@/lib/actions/budgets";
import { CategoryIcon } from "@/components/shared/category-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: BudgetActionState = { status: "idle" };

function progressTone(progress: BudgetProgress) {
  if (progress.isOverBudget) return "bg-danger";
  if (progress.progress >= 0.85) return "bg-warning";
  return "bg-primary";
}

export function BudgetRow({
  category,
  monthStart,
  budgetId,
  progress,
}: {
  category: Category;
  monthStart: string;
  budgetId: string | null;
  progress: BudgetProgress | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(setBudgetAction, initialState);
  const [isDeleting, startDeleteTransition] = useTransition();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && state.status === "idle") {
      setIsEditing(false);
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  const hasBudget = progress !== null;
  const percent = hasBudget ? Math.min(100, Math.round(progress.progress * 100)) : 0;

  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-muted text-foreground-muted">
            <CategoryIcon icon={category.icon} className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium text-foreground">{category.name}</p>
        </div>

        {hasBudget ? (
          <p className="text-sm tabular-nums text-foreground-muted">
            <span className={progress.isOverBudget ? "font-medium text-danger" : "font-medium text-foreground"}>
              {formatCurrency(progress.spent)}
            </span>{" "}
            / {formatCurrency(progress.budgetAmount)}
          </p>
        ) : (
          <p className="text-sm text-foreground-muted">No budget set</p>
        )}
      </div>

      {hasBudget ? (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div className={`h-full rounded-full ${progressTone(progress)}`} style={{ width: `${percent}%` }} />
        </div>
      ) : null}

      {isEditing ? (
        <form action={formAction} className="mt-3 flex items-center gap-2">
          <input type="hidden" name="categoryId" value={category.id} />
          <input type="hidden" name="monthStart" value={monthStart} />
          <Input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            defaultValue={progress?.budgetAmount}
            placeholder="Amount"
            className="w-32"
            aria-label={`Budget amount for ${category.name}`}
          />
          <Button type="submit" size="sm" isLoading={isPending}>
            Save
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <div className="mt-3 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-[var(--radius-control)] px-2 py-1 text-xs font-medium text-foreground-muted hover:bg-surface-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            {hasBudget ? "Edit" : "Set budget"}
          </button>
          {hasBudget && budgetId ? (
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => startTransitionDelete(budgetId, startDeleteTransition)}
              className="flex items-center gap-1.5 rounded-[var(--radius-control)] px-2 py-1 text-xs font-medium text-foreground-muted hover:bg-danger/10 hover:text-danger disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          ) : null}
        </div>
      )}

      {state.status === "error" && isEditing ? (
        <p role="alert" className="mt-2 text-xs text-danger">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

function startTransitionDelete(id: string, startTransition: (callback: () => void) => void) {
  if (!window.confirm("Remove this budget?")) return;
  startTransition(() => {
    void deleteBudgetAction(id);
  });
}
