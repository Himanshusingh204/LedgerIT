import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

// Only features that exist in the app today. Don't add a plan or a line item
// here until the feature is built and tested.
const INCLUDED = [
  "Unlimited transactions",
  "Unlimited accounts",
  "Monthly budgets per category",
  "Receipt photo uploads (private)",
  "CSV export that respects your filters",
  "Analytics, trends and top merchants",
  "Password-protected, row-level-secured data",
  "No ads, no tracking, no bank logins",
];

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          One plan. Free.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-foreground-muted">
          Clearledger is free while it is in early access. Every feature below is included.
        </p>
      </div>

      <div className="card-surface mx-auto mt-12 max-w-xl p-8 sm:p-10">
        <div className="flex items-baseline gap-2">
          <span className="text-num text-5xl font-semibold text-foreground">$0</span>
          <span className="text-sm text-foreground-muted">forever, for personal use</span>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
              <Check className="mt-0.5 h-4 w-4 flex-none text-primary" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/sign-up"
          className="btn-color-changing mt-9 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] text-sm"
        >
          Create free account
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
