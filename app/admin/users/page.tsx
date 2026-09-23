import type { Metadata } from "next";
import { Shield, User as UserIcon, Calendar, Clock, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAdminUsers } from "@/lib/data/admin";
import { AdminPageTransition } from "@/components/admin/admin-page-transition";

export const metadata: Metadata = {
  title: "User Directory",
};

interface UsersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const searchQuery = typeof params.q === "string" ? params.q.toLowerCase().trim() : "";

  const supabase = await createClient();
  const allUsers = await listAdminUsers(supabase);

  const users = searchQuery
    ? allUsers.filter(
        (u) =>
          u.display_name?.toLowerCase().includes(searchQuery) ||
          u.id.toLowerCase().includes(searchQuery) ||
          u.currency.toLowerCase().includes(searchQuery),
      )
    : allUsers;

  return (
    <AdminPageTransition className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            User Directory
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Inspect all registered user profiles and administrative privilege assignments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground">
            Total Users: {allUsers.length}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <form method="GET" className="flex max-w-md items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by name, UUID, or currency..."
            aria-label="Search users"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            href="/admin/users"
            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground-muted hover:text-foreground"
          >
            Clear
          </a>
        )}
      </form>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground-muted">
            <thead className="border-b border-border bg-surface-muted/50 text-[11px] font-semibold uppercase tracking-wider text-foreground">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  User Profile
                </th>
                <th scope="col" className="px-6 py-3.5">
                  User UUID
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Base Currency
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Timezone
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Access Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-foreground-muted">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-surface-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {user.display_name ? user.display_name[0].toUpperCase() : <UserIcon className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {user.display_name ?? "Unnamed Member"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-foreground-muted">
                      {user.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] font-medium text-foreground">
                        <Globe className="h-3 w-3 text-foreground-muted" />
                        {user.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{user.timezone || "UTC"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(user.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          <Shield className="h-3 w-3" />
                          Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium text-foreground-muted">
                          Member
                        </span>
                      )}
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
