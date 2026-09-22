"use client";

import { useState, useTransition } from "react";
import { Archive, Pencil, Tags } from "lucide-react";
import type { Category } from "@/types/database";
import { archiveCategoryAction, renameCategoryAction } from "@/lib/actions/categories";
import { CategoryIcon } from "@/components/shared/category-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddCategoryForm } from "@/components/settings/add-category-form";

const KIND_LABELS: Record<Category["kind"], string> = {
  expense: "Expense",
  income: "Income",
};

function CategoryRow({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [isPending, startTransition] = useTransition();
  const isSystemCategory = category.user_id === null;

  function handleRename() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === category.name) {
      setIsEditing(false);
      setName(category.name);
      return;
    }
    startTransition(async () => {
      await renameCategoryAction(category.id, trimmed);
      setIsEditing(false);
    });
  }

  function handleArchive() {
    if (!window.confirm(`Archive "${category.name}"? Past transactions keep it, new ones can't use it.`)) return;
    startTransition(() => {
      void archiveCategoryAction(category.id);
    });
  }

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-[var(--radius-control)] bg-surface-muted text-foreground-muted">
          <CategoryIcon icon={category.icon} className="h-4 w-4" />
        </span>
        {isEditing ? (
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleRename();
              if (event.key === "Escape") {
                setIsEditing(false);
                setName(category.name);
              }
            }}
            autoFocus
            className="h-8 w-40"
            aria-label={`Rename ${category.name}`}
          />
        ) : (
          <div>
            <p className="text-sm font-medium text-foreground">{category.name}</p>
            <p className="text-xs text-foreground-muted">
              {KIND_LABELS[category.kind]}
              {isSystemCategory ? " · Default" : ""}
            </p>
          </div>
        )}
      </div>

      {isSystemCategory ? null : isEditing ? (
        <div className="flex items-center gap-1">
          <Button size="sm" isLoading={isPending} onClick={handleRename}>
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              setName(category.name);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={`Rename ${category.name}`}
            className="flex items-center gap-1.5 rounded-[var(--radius-control)] px-2 py-1.5 text-xs font-medium text-foreground-muted hover:bg-surface-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleArchive}
            aria-label={`Archive ${category.name}`}
            className="flex items-center gap-1.5 rounded-[var(--radius-control)] px-2 py-1.5 text-xs font-medium text-foreground-muted hover:bg-surface-muted hover:text-foreground disabled:opacity-50"
          >
            <Archive className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </li>
  );
}

export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-5">
      <h2 className="text-sm font-medium text-foreground-muted">Categories</h2>

      {categories.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
          <Tags className="h-6 w-6 text-foreground-muted" aria-hidden />
          <p className="text-sm text-foreground-muted">No categories yet.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </ul>
      )}

      <div className="mt-4">
        <AddCategoryForm />
      </div>
    </div>
  );
}
