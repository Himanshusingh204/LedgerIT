"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { createCategoryAction, type CategoryActionState } from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CategoryActionState = { status: "idle" };

export function AddCategoryForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createCategoryAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && state.status === "idle") {
      formRef.current?.reset();
      setIsOpen(false);
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" aria-hidden />
        Add category
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-[var(--radius-surface)] border border-border bg-surface p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="category-name">Name</Label>
          <Input id="category-name" name="name" type="text" placeholder="e.g. Pet care" required />
        </div>
        <div>
          <Label htmlFor="category-kind">Type</Label>
          <select
            id="category-kind"
            name="kind"
            defaultValue="expense"
            className="h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          Add category
        </Button>
      </div>
    </form>
  );
}
