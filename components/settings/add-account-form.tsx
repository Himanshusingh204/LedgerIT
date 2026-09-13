"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { createAccountAction, type AccountActionState } from "@/lib/actions/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AccountActionState = { status: "idle" };

const ACCOUNT_TYPES = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank account" },
  { value: "debit_card", label: "Debit card" },
  { value: "credit_card", label: "Credit card" },
  { value: "other", label: "Other" },
] as const;

export function AddAccountForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createAccountAction, initialState);
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
        Add account
      </Button>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-[var(--radius-surface)] border border-border bg-surface p-4">
      <div>
        <Label htmlFor="account-name">Name</Label>
        <Input id="account-name" name="name" type="text" placeholder="e.g. Everyday checking" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="account-type">Type</Label>
          <select
            id="account-type"
            name="type"
            defaultValue="bank"
            className="h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
          >
            {ACCOUNT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="account-currency">Currency</Label>
          <Input id="account-currency" name="currency" type="text" maxLength={3} defaultValue="USD" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="account-lastFour">Last 4 digits (optional)</Label>
          <Input id="account-lastFour" name="lastFour" type="text" maxLength={4} placeholder="1234" />
        </div>
        <div>
          <Label htmlFor="account-openingBalance">Opening balance</Label>
          <Input id="account-openingBalance" name="openingBalance" type="number" step="0.01" min="0" defaultValue="0" />
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
          Add account
        </Button>
      </div>
    </form>
  );
}
