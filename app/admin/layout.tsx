import Link from "next/link";
import { ShieldCheck, LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Clearledger admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-foreground-muted hover:text-foreground">
              Back to app
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
