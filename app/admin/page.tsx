import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  CreditCard,
  MessageSquare,
  Tags,
  ShieldCheck,
  ArrowRight,
  Database,
  Lock,
  HardDrive,
  Activity,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminPlatformStats, listAdminFeedback } from "@/lib/data/admin";
import { AdminPageTransition } from "@/components/admin/admin-page-transition";

export const metadata: Metadata = {
  title: "Platform Overview",
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const [stats, recentFeedback] = await Promise.all([
    getAdminPlatformStats(supabase),
    listAdminFeedback(supabase),
  ]);

  const previewFeedback = recentFeedback.slice(0, 4);

  return (
    <AdminPageTransition className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Platform Command Center
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Live telemetry, system health, user metrics, and visitor communications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            All Systems Operational
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-border-focus hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-foreground-muted">
              Registered Users
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {stats.user_count.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-400">active</span>
          </div>
          <Link
            href="/admin/users"
            className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span>View user directory</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Transactions Recorded */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-border-focus hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-foreground-muted">
              Ledger Transactions
            </span>
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {stats.transaction_count.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-foreground-muted">posted</span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-foreground-muted">
            <span>Across {stats.accounts_count} accounts</span>
          </div>
        </div>

        {/* Community Inquiries */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-border-focus hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-foreground-muted">
              Feedback Messages
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {stats.feedback_count.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-foreground-muted">submissions</span>
          </div>
          <Link
            href="/admin/feedback"
            className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span>Triage feedback inbox</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Default Taxonomy */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-border-focus hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-foreground-muted">
              System Taxonomy
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
              <Tags className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {stats.system_categories_count}
            </span>
            <span className="text-xs font-medium text-emerald-400">categories</span>
          </div>
          <Link
            href="/admin/categories"
            className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span>Inspect system categories</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Middle Section: Security & System Invariants */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Security & Platform Invariants
              </h2>
            </div>
            <span className="text-xs text-foreground-muted">Enforced at Database & Edge</span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface-muted/30 p-4">
              <div className="flex items-center gap-2 text-foreground">
                <Database className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold">Row-Level Security</span>
              </div>
              <p className="mt-2 text-xs text-foreground-muted leading-relaxed">
                PostgreSQL policies isolate all transactions, budgets, and user accounts.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <span>Active on 100% tables</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/30 p-4">
              <div className="flex items-center gap-2 text-foreground">
                <Lock className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-semibold">CSP Nonce Engine</span>
              </div>
              <p className="mt-2 text-xs text-foreground-muted leading-relaxed">
                Per-request cryptographic nonces guard against XSS and unauthorized scripts.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-blue-400">
                <span>Strict-Dynamic Active</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-muted/30 p-4">
              <div className="flex items-center gap-2 text-foreground">
                <HardDrive className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-semibold">Private Storage</span>
              </div>
              <p className="mt-2 text-xs text-foreground-muted leading-relaxed">
                Receipts stored in private buckets with short-lived 60s signed access URLs.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-purple-400">
                <span>Signed Access Only</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-background/50 p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-medium text-foreground">Want to run diagnostics?</p>
                <p className="text-[11px] text-foreground-muted">
                  Inspect database connection status, environment variables, and error telemetry.
                </p>
              </div>
            </div>
            <Link
              href="/admin/system"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <span>System Telemetry</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Admin Quick Actions</h2>
          <p className="mt-1 text-xs text-foreground-muted">
            Direct shortcuts to key administration portals.
          </p>

          <div className="mt-5 space-y-3">
            <Link
              href="/admin/users"
              className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:border-primary/50 hover:bg-surface-muted"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-medium text-foreground">User Management</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
            </Link>

            <Link
              href="/admin/feedback"
              className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:border-primary/50 hover:bg-surface-muted"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-medium text-foreground">Feedback Inbox</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:border-primary/50 hover:bg-surface-muted"
            >
              <div className="flex items-center gap-3">
                <Tags className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium text-foreground">System Categories</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
            </Link>

            <Link
              href="/admin/system"
              className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:border-primary/50 hover:bg-surface-muted"
            >
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-medium text-foreground">Health & Logs</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-foreground-muted" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Visitor Communications */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Recent Visitor Feedback</h2>
            <p className="mt-0.5 text-xs text-foreground-muted">
              Latest inquiries submitted through the marketing feedback form.
            </p>
          </div>
          <Link
            href="/admin/feedback"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>Open Inbox ({recentFeedback.length})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-5 divide-y divide-border">
          {previewFeedback.length === 0 ? (
            <div className="py-8 text-center text-xs text-foreground-muted">
              No feedback entries submitted yet.
            </div>
          ) : (
            previewFeedback.map((entry) => (
              <div key={entry.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{entry.name}</span>
                    {entry.email && (
                      <span className="text-xs text-foreground-muted font-mono">({entry.email})</span>
                    )}
                  </div>
                  <span className="text-xs text-foreground-muted">
                    {new Date(entry.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-2 text-xs text-foreground/90 line-clamp-2 leading-relaxed">
                  {entry.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminPageTransition>
  );
}
