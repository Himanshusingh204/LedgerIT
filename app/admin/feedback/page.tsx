import type { Metadata } from "next";
import { MessageSquare, Mail, Calendar, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAdminFeedback } from "@/lib/data/admin";
import { AdminPageTransition } from "@/components/admin/admin-page-transition";
import { FeedbackDeleteButton } from "@/components/admin/feedback-delete-button";

export const metadata: Metadata = {
  title: "Feedback Inbox",
};

interface FeedbackPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminFeedbackPage({ searchParams }: FeedbackPageProps) {
  const params = await searchParams;
  const searchQuery = typeof params.q === "string" ? params.q.trim() : "";

  const supabase = await createClient();
  const feedbackList = await listAdminFeedback(supabase, searchQuery);

  return (
    <AdminPageTransition className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Feedback & Inquiries Inbox
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Review, reply, and triage messages submitted through the public marketing feedback form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground">
            Total Messages: {feedbackList.length}
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <form method="GET" className="flex max-w-md items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by sender name, email, or message keyword..."
            aria-label="Search feedback"
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Search
        </button>
        {searchQuery && (
          <a
            href="/admin/feedback"
            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground-muted hover:text-foreground"
          >
            Clear
          </a>
        )}
      </form>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbackList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
            <MessageSquare className="h-10 w-10 text-foreground-muted/50" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">Inbox is clean</h3>
            <p className="mt-1 text-xs text-foreground-muted">
              {searchQuery
                ? "No feedback matched your search criteria."
                : "No visitor submissions have been recorded yet."}
            </p>
          </div>
        ) : (
          feedbackList.map((entry) => (
            <div
              key={entry.id}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:border-border-focus"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold text-foreground">{entry.name}</span>
                    <span className="rounded-full border border-border bg-surface-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground-muted">
                      Visitor Feedback
                    </span>
                  </div>
                  {entry.email ? (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-primary">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${entry.email}`} className="hover:underline">
                        {entry.email}
                      </a>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-foreground-muted italic">No email provided (Anonymous)</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-foreground-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <FeedbackDeleteButton id={entry.id} senderName={entry.name} />
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-border/70 bg-background/50 p-4">
                <p className="whitespace-pre-wrap text-xs text-foreground leading-relaxed">
                  {entry.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPageTransition>
  );
}
