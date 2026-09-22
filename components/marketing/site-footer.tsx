import Link from "next/link";
import { Wallet } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="grid h-7 w-7 place-items-center rounded-[var(--radius-control)] bg-primary text-primary-foreground">
            <Wallet className="h-3.5 w-3.5" />
          </span>
          Clearledger
        </Link>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground-muted">
          <a href="#why" className="hover:text-foreground">Why Clearledger</a>
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#feedback" className="hover:text-foreground">Feedback</a>
          <Link href="/sign-in" className="hover:text-foreground">Sign in</Link>
        </nav>

        <p className="text-xs text-foreground-muted">© {new Date().getFullYear()} Clearledger. All rights reserved.</p>
      </div>
    </footer>
  );
}
