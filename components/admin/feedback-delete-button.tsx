"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteFeedbackAction } from "@/lib/actions/admin";

interface FeedbackDeleteButtonProps {
  id: string;
  senderName: string;
}

export function FeedbackDeleteButton({ id, senderName }: FeedbackDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete feedback message from "${senderName}"? This action cannot be undone.`);
    if (!confirmed) return;

    startTransition(async () => {
      const res = await deleteFeedbackAction(id);
      if (res.status === "error") {
        alert(res.message || "Failed to delete feedback.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete this feedback entry"
      aria-label={`Delete feedback from ${senderName}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>{isPending ? "Deleting..." : "Delete"}</span>
    </button>
  );
}
