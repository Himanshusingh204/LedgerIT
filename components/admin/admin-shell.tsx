"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  MessageSquare,
  Tags,
  Activity,
  ArrowUpRight,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Home,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users Directory", icon: Users },
  { href: "/admin/feedback", label: "Feedback Inbox", icon: MessageSquare },
  { href: "/admin/categories", label: "System Categories", icon: Tags },
  { href: "/admin/system", label: "Health & Monitoring", icon: Activity },
];

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header: Clicking Logo Leads to HOME PAGE (/) */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link
            href="/"
            title="Return to LedgerIT Home"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-700 text-white shadow-sm ring-1 ring-white/20">
              <ShieldCheck className="h-5 w-5 transition-transform group-hover:scale-105" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                Ledger<span className="text-primary">IT</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-muted hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6" aria-label="Admin navigation">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
            Management
          </div>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary-foreground" : "text-foreground-muted"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="mt-8 mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
            Quick Portals
          </div>
          <Link
            href="/"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 shrink-0" />
              <span>Marketing Site</span>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>App Dashboard</span>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </nav>

        {/* User Footer Bar */}
        <div className="border-t border-border bg-surface-muted/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {userEmail ?? "Administrator"}
              </p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-foreground-muted">
                  Super Admin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                title="Toggle Theme"
                className="rounded-lg p-2 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <form action={signOutAction}>
                <button
                  type="submit"
                  title="Sign out of Admin"
                  className="rounded-lg p-2 text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="rounded-lg p-2 text-foreground-muted hover:bg-surface-muted hover:text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <Link href="/" className="hover:text-foreground">
                LedgerIT
              </Link>
              <span>/</span>
              <Link href="/admin" className="font-medium text-foreground">
                Admin
              </Link>
              {pathname !== "/admin" && (
                <>
                  <span>/</span>
                  <span className="font-semibold capitalize text-primary">
                    {pathname.replace("/admin/", "").replace("-", " ")}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:inline-flex"
            >
              <span>Open Personal App</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </Link>
          </div>
        </header>

        {/* Page View Container */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
