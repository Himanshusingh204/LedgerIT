"use client";

import Link from "next/link";
import { useState, useEffect, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Moon, Sun, Wallet, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#why", label: "Why Clearledger" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const mounted = useIsMounted();

  useEffect(() => {
    const savedTheme = localStorage.getItem("cl_theme") as "light" | "dark" | "system" | null;
    if (savedTheme) {
      // Schedule theme update asynchronously to avoid cascading renders
      queueMicrotask(() => {
        setTheme(savedTheme);
        if (savedTheme === "system") {
          document.documentElement.removeAttribute("data-theme");
        } else {
          document.documentElement.setAttribute("data-theme", savedTheme);
        }
      });
    }

    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("cl_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backgroundColor: scrolled ? "var(--glass-header-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.06)" : "none",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          id="site-logo"
          className="flex items-center gap-2.5 font-bold text-foreground transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md"
          onClick={() => setIsMenuOpen(false)}
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-[var(--radius-control)] text-white shadow-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">Clearledger</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm px-1 py-0.5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="flex items-center gap-3">
          {/* Interactive Color/Theme Toggle Button */}
          {mounted && (
            <button
              type="button"
              id="theme-color-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface text-foreground-muted transition-all hover:bg-surface-muted hover:text-foreground hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 rotate-0" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-blue-500 transition-transform duration-200 rotate-0" aria-hidden="true" />
              )}
            </button>
          )}

          <Link
            href="/sign-in"
            id="header-signin"
            className="hidden rounded-[var(--radius-control)] px-3.5 py-2 text-sm font-semibold text-foreground-muted transition-colors hover:text-foreground hover:bg-surface-muted sm:inline-block focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Sign in
          </Link>

          {/* Color-changing animated gradient button */}
          <Link
            href="/sign-up"
            id="header-signup"
            className="btn-color-changing relative inline-flex items-center justify-center rounded-[var(--radius-control)] px-4 py-2 text-sm font-semibold tracking-wide text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Start free
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="grid h-9 w-9 flex-none place-items-center rounded-[var(--radius-control)] border border-border text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground md:hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-b border-border bg-surface md:hidden shadow-lg"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-semibold text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 border-t border-border pt-2 flex items-center justify-between">
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-[var(--radius-control)] px-3 py-2 text-sm font-semibold text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  Sign in
                </Link>
                {mounted && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 rounded-[var(--radius-control)] border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface-muted"
                  >
                    {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-blue-500" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
