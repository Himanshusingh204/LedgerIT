"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Wallet, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#why", label: "Why Clearledger" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground" onClick={() => setIsMenuOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] bg-primary text-primary-foreground">
            <Wallet className="h-4 w-4" />
          </span>
          Clearledger
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:text-foreground sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-[var(--radius-control)] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Start tracking
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 flex-none place-items-center rounded-[var(--radius-control)] text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-b border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-[var(--radius-control)] px-2 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-[var(--radius-control)] px-2 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                Sign in
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
