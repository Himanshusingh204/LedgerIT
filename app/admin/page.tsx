import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listFeedback } from "@/lib/data/feedback";

export const metadata: Metadata = {
  title: "Admin",
};

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const supabase = await createClient();
  const feedback = await listFeedback(supabase);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Visitor feedback</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Everything submitted through the marketing site&apos;s feedback form. Restricted to admins by
        row-level security — this page is only reachable because you&apos;re one.
      </p>

      <div className="mt-8 space-y-4">
        {feedback.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[var(--radius-surface-lg)] border border-dashed border-border py-16 text-center">
            <MessageSquare className="h-8 w-8 text-foreground-muted" aria-hidden />
            <p className="text-sm text-foreground-muted">No feedback submitted yet.</p>
          </div>
        ) : (
          feedback.map((entry) => (
            <div key={entry.id} className="rounded-[var(--radius-surface-lg)] border border-border bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-medium text-foreground">{entry.name}</p>
                <p className="text-xs text-foreground-muted">{formatDate(entry.created_at)}</p>
              </div>
              {entry.email ? <p className="text-xs text-foreground-muted">{entry.email}</p> : null}
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{entry.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
