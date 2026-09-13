"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import type { Account, Category, Transaction, TransactionType } from "@/types/database";
import { createTransactionAction, updateTransactionAction, type TransactionActionState } from "@/lib/actions/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: TransactionActionState = { status: "idle" };

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
  { value: "transfer", label: "Transfer" },
];

function toDateInputValue(isoString: string): string {
  return isoString.slice(0, 10);
}

export function TransactionForm({
  accounts,
  categories,
  transaction,
  onSuccess,
}: {
  accounts: Account[];
  categories: Category[];
  transaction?: Transaction;
  onSuccess: () => void;
}) {
  const formId = useId();
  const action = transaction
    ? updateTransactionAction.bind(null, transaction.id)
    : createTransactionAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && state.status === "idle") {
      onSuccess();
    }
    wasPending.current = isPending;
  }, [isPending, state, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        {TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center justify-center rounded-[var(--radius-control)] border border-border px-3 py-2 text-sm font-medium text-foreground-muted has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary"
          >
            <input
              type="radio"
              name="type"
              value={option.value}
              defaultChecked={(transaction?.type ?? "expense") === option.value}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {state.fieldErrors?.type ? <p className="text-sm text-danger">{state.fieldErrors.type}</p> : null}

      <div>
        <Label htmlFor={`${formId}-amount`}>Amount</Label>
        <Input
          id={`${formId}-amount`}
          name="amount"
          type="number"
          step="0.01"
          min="0"
          defaultValue={transaction?.amount}
          hasError={!!state.fieldErrors?.amount}
          aria-invalid={!!state.fieldErrors?.amount}
        />
        {state.fieldErrors?.amount ? <p className="mt-1.5 text-sm text-danger">{state.fieldErrors.amount}</p> : null}
      </div>

      <div>
        <Label htmlFor={`${formId}-accountId`}>Account</Label>
        <select
          id={`${formId}-accountId`}
          name="accountId"
          defaultValue={transaction?.account_id ?? ""}
          className="h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
        >
          <option value="" disabled>
            Choose an account
          </option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {state.fieldErrors?.accountId ? (
          <p className="mt-1.5 text-sm text-danger">{state.fieldErrors.accountId}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor={`${formId}-categoryId`}>Category</Label>
        <select
          id={`${formId}-categoryId`}
          name="categoryId"
          defaultValue={transaction?.category_id ?? ""}
          className="h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor={`${formId}-merchant`}>Merchant</Label>
        <Input id={`${formId}-merchant`} name="merchant" type="text" defaultValue={transaction?.merchant ?? ""} />
      </div>

      <div>
        <Label htmlFor={`${formId}-occurredAt`}>Date</Label>
        <Input
          id={`${formId}-occurredAt`}
          name="occurredAt"
          type="date"
          defaultValue={transaction ? toDateInputValue(transaction.occurred_at) : toDateInputValue(new Date().toISOString())}
          hasError={!!state.fieldErrors?.occurredAt}
        />
        {state.fieldErrors?.occurredAt ? (
          <p className="mt-1.5 text-sm text-danger">{state.fieldErrors.occurredAt}</p>
        ) : null}
      </div>

      <div>
        <Label htmlFor={`${formId}-note`}>Note</Label>
        <textarea
          id={`${formId}-note`}
          name="note"
          rows={2}
          defaultValue={transaction?.note ?? ""}
          className="w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
        />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          Save transaction
        </Button>
      </div>
    </form>
  );
}
