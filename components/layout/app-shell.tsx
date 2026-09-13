"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Receipt, PiggyBank, BarChart3, Settings, Wallet, LogOut, Menu, X } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/budgets", label: "Budgets", icon: PiggyBank },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </span>
            Clearledger
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-surface-muted text-foreground" : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <form action={signOutAction} className="hidden md:block">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="grid h-9 w-9 place-items-center rounded-[var(--radius-control)] text-foreground-muted hover:bg-surface-muted hover:text-foreground md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-b border-border md:hidden">
            <nav className="flex flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-[var(--radius-control)] px-2 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-surface-muted text-foreground" : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-[var(--radius-control)] px-2 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Sign out
                </button>
              </form>
            </nav>
          </div>
        ) : null}
      </header>

      <main>{children}</main>
    </div>
  );
}
