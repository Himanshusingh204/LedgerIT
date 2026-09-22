"use client";

import Link from "next/link";
import { Check, Zap, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const FREE_FEATURES = [
  "Unlimited transactions",
  "Up to 10 accounts",
  "All budget categories",
  "Receipt photo uploads",
  "CSV export with filters",
  "Analytics & trend charts",
  "Password-protected account",
  "No ads, no tracking",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Receipt OCR scanning",
  "Multi-currency support",
  "Shared household access",
  "Budget rollover rules",
  "Priority support",
];

function FeatureItem({ text, muted = false }: { text: string; muted?: boolean }) {
  return (
    <li className={`flex items-start gap-2.5 text-sm ${muted ? "opacity-60" : ""}`}>
      <Check
        className={`mt-0.5 h-4 w-4 flex-none ${muted ? "text-foreground-muted" : "text-success"}`}
        aria-hidden="true"
      />
      <span className={muted ? "line-through text-foreground-muted" : "text-foreground"}>
        {text}
      </span>
    </li>
  );
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-y border-border bg-surface"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-14 max-w-xl text-center"
        >
          <p className="label-caps text-primary mb-3">Pricing</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-base text-foreground-muted">
            Start free — no card required. Everything you need is in the free plan.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 1, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2"
        >
          {/* Free card */}
          <div className="flex flex-col rounded-[var(--radius-surface-lg)] border border-border bg-background p-8">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] bg-primary/10">
                <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold text-foreground">Free</h3>
            </div>
            <div className="mt-6 flex items-end gap-1">
              <span className="text-5xl font-bold tracking-tight text-foreground">$0</span>
              <span className="mb-1 text-sm text-foreground-muted">/ forever</span>
            </div>
            <p className="mt-2 text-sm text-foreground-muted">
              Everything you need to track spending and stay on budget.
            </p>
            <Link
              href="/sign-up"
              id="pricing-free-cta"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
            >
              Start tracking — it&apos;s free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ul className="mt-8 space-y-3" aria-label="Free plan features">
              {FREE_FEATURES.map((f) => (
                <FeatureItem key={f} text={f} />
              ))}
            </ul>
          </div>

          {/* Pro card — gradient border, coming soon */}
          <div
            className="gradient-border flex flex-col p-8"
            aria-label="Pro plan — coming soon"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="grid h-8 w-8 place-items-center rounded-[var(--radius-control)] text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-foreground">Pro</h3>
              </div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Coming soon
              </span>
            </div>
            <div className="mt-6 flex items-end gap-1">
              <span className="text-5xl font-bold tracking-tight text-foreground opacity-50">$?</span>
              <span className="mb-1 text-sm text-foreground-muted opacity-50">/ month</span>
            </div>
            <p className="mt-2 text-sm text-foreground-muted">
              Advanced features for power users and shared households.
            </p>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-6 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-[var(--radius-control)] border border-border px-5 py-3 text-sm font-semibold text-foreground-muted opacity-60"
            >
              Notify me when available
            </button>
            <ul className="mt-8 space-y-3 opacity-60" aria-label="Pro plan features (coming soon)">
              {PRO_FEATURES.map((f) => (
                <FeatureItem key={f} text={f} muted />
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
