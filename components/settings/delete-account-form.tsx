"use client";

import { useActionState } from "react";
import { deleteAccountAction, type DeleteAccountState } from "@/lib/actions/account";

const initial: DeleteAccountState = { status: "idle" };

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(deleteAccountAction, initial);

  return (
    <form action={formAction} className="space-y-3">
      <p className="text-sm text-foreground-muted">
        This permanently deletes your account, every account, transaction, budget, category and receipt
        you have added. It cannot be undone. Export a CSV first if you want a copy.
      </p>
      <label htmlFor="delete-confirm" className="block text-sm font-medium text-foreground">
        Type <span className="text-num">DELETE</span> to confirm
      </label>
      <input
        id="delete-confirm"
        name="confirm"
        autoComplete="off"
        className="h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground"
      />
      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center rounded-[var(--radius-control)] bg-danger px-4 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Delete my account"}
      </button>
    </form>
  );
}
