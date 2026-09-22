"use client";

import { useActionState, useId } from "react";
import { submitFeedbackAction, type FeedbackActionState } from "@/lib/actions/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: FeedbackActionState = { status: "idle" };

export function FeedbackForm() {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(submitFeedbackAction, initialState);

  if (state.status === "success") {
    return (
      <p role="status" className="text-sm text-foreground-muted">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${formId}-name`}>Name</Label>
          <Input id={`${formId}-name`} name="name" required maxLength={120} />
        </div>
        <div>
          <Label htmlFor={`${formId}-email`}>Email (optional)</Label>
          <Input id={`${formId}-email`} name="email" type="email" maxLength={255} />
        </div>
      </div>
      <div>
        <Label htmlFor={`${formId}-message`}>What&apos;s on your mind?</Label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={4}
          maxLength={2000}
          placeholder="A bug, a feature idea, or just what you think — we read all of it."
          className="w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
        />
      </div>
      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" isLoading={isPending}>
        Send feedback
      </Button>
    </form>
  );
}
