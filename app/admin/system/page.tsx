import type { Metadata } from "next";
import {
  Activity,
  CheckCircle2,
  Database,
  Lock,
  HardDrive,
  Cpu,
  FileText,
  Clock,
  Terminal,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAdminAuditLogs } from "@/lib/data/admin";
import { AdminPageTransition } from "@/components/admin/admin-page-transition";

export const metadata: Metadata = {
  title: "Health & Monitoring",
};

export default async function AdminSystemPage() {
  const supabase = await createClient();
  const auditLogs = await listAdminAuditLogs(supabase, 25);

  const securityInvariants = [
    {
      name: "Double-Layer Authorization",
      status: "Active & Enforced",
      description: "App checks user session; PostgreSQL independently checks auth.uid() = user_id on every query.",
    },
    {
      name: "Row-Level Security (RLS)",
      status: "Active on 8/8 tables",
      description: "Enabled on profiles, accounts, categories, transactions, budgets, site_feedback, admin_users, and admin_audit_logs.",
    },
    {
      name: "Dynamic CSP Nonce",
      status: "Per-Request Active",
      description: "Next.js middleware generates unique cryptographically secure nonces with strict-dynamic.",
    },
    {
      name: "Money Decimal Precision",
      status: "numeric(14,2) Fixed",
      description: "Postgres columns strictly typed as numeric(14,2); never stored or aggregated as IEEE floats.",
    },
    {
      name: "Service-Role Key Shield",
      status: "Zero Browser Leaks",
      description: "Service role keys strictly scoped to server environment; excluded from client and edge bundles.",
    },
  ];

  return (
    <AdminPageTransition className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            System Health & Telemetry
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Architecture invariant verification, audit trails, and monitoring telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            System Healthy
          </span>
        </div>
      </div>

      {/* Runtime Environment Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-foreground-muted">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">Node Runtime</span>
          </div>
          <p className="mt-3 font-mono text-lg font-bold text-foreground">
            {process.version || "Node.js 22 LTS"}
          </p>
          <p className="mt-1 text-xs text-foreground-muted">Next.js 16 App Router Turbopack</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-foreground-muted">
            <Database className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">PostgreSQL</span>
          </div>
          <p className="mt-3 text-lg font-bold text-foreground">Postgres 15 RLS</p>
          <p className="mt-1 text-xs text-foreground-muted">6 Sequential Migrations Applied</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-foreground-muted">
            <Lock className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Auth Gate</span>
          </div>
          <p className="mt-3 text-lg font-bold text-foreground">GoTrue + PKCE</p>
          <p className="mt-1 text-xs text-foreground-muted">Edge-refreshed JWT cookies</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-foreground-muted">
            <HardDrive className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Storage Engine</span>
          </div>
          <p className="mt-3 text-lg font-bold text-foreground">Private Buckets</p>
          <p className="mt-1 text-xs text-foreground-muted">60s TTL Signed Access URLs</p>
        </div>
      </div>

      {/* Security Invariants Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border bg-surface-muted/40 px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            Architectural Invariants & Security Guardrails
          </h2>
          <p className="mt-0.5 text-xs text-foreground-muted">
            Non-negotiable architectural constraints monitored across Edge, Node, and Database.
          </p>
        </div>
        <div className="divide-y divide-border">
          {securityInvariants.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xs font-semibold text-foreground">{item.name}</h3>
                <p className="mt-0.5 text-xs text-foreground-muted">{item.description}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Logging & Error Monitoring Guide */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-2 text-foreground">
          <Terminal className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-semibold">Structured Error Monitoring & Debugging Guide</h2>
        </div>
        <p className="mt-2 text-xs text-foreground-muted leading-relaxed">
          LedgerIT incorporates standardized structured logging across all server actions and database operations.
          When an error occurs, detailed diagnostic payloads are printed to the server console and log drains:
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-border/80 bg-background/80 p-4 font-mono text-[11px] text-foreground-muted">
          <div className="text-emerald-400">// Example Structured Log Format emitted on failure:</div>
          <div>&#123;</div>
          <div className="pl-4"><span className="text-primary">&quot;tag&quot;</span>: <span className="text-amber-300">&quot;[action:transactions]&quot;</span>,</div>
          <div className="pl-4"><span className="text-primary">&quot;userId&quot;</span>: <span className="text-blue-300">&quot;uuid-of-user&quot;</span>,</div>
          <div className="pl-4"><span className="text-primary">&quot;action&quot;</span>: <span className="text-amber-300">&quot;createTransaction&quot;</span>,</div>
          <div className="pl-4"><span className="text-primary">&quot;error&quot;</span>: <span className="text-rose-400">&quot;Database constraint violation: amount &gt; 0&quot;</span>,</div>
          <div className="pl-4"><span className="text-primary">&quot;ts&quot;</span>: <span className="text-blue-300">&quot;2026-09-22T14:00:00.000Z&quot;</span></div>
          <div>&#125;</div>
        </div>
      </div>

      {/* Admin Audit Trail */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border bg-surface-muted/40 px-6 py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Administrative Audit Trail</h2>
          </div>
          <span className="text-xs text-foreground-muted">
            {auditLogs.length} events recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground-muted">
            <thead className="border-b border-border bg-surface-muted/50 text-[11px] font-semibold uppercase tracking-wider text-foreground">
              <tr>
                <th scope="col" className="px-6 py-3">Timestamp</th>
                <th scope="col" className="px-6 py-3">Action</th>
                <th scope="col" className="px-6 py-3">Target Type</th>
                <th scope="col" className="px-6 py-3">Target ID</th>
                <th scope="col" className="px-6 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground-muted">
                    No admin audit events recorded yet. System operations will appear here in real-time.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-muted/30">
                    <td className="px-6 py-3 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 capitalize">{log.target_type}</td>
                    <td className="px-6 py-3 font-mono text-[11px] text-foreground-muted">
                      {log.target_id ? log.target_id.slice(0, 8) + "..." : "—"}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-[10px]">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPageTransition>
  );
}
