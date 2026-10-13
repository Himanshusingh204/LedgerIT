import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeatureHighlights } from "@/components/marketing/feature-highlights";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything Clearledger does: fast expense entry, budgets, accounts, analytics, receipts and CSV export.",
};

export default function FeaturesPage() {
  return (
    <>
      <section className="gradient-mesh px-4 pb-4 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Everything you need to track <span className="gradient-text">everyday</span> spending.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-foreground-muted">
          Quick entry, clear totals, budgets that stay current, and a CSV export whenever you need one.
        </p>
      </section>
      <FeatureHighlights />
      <section className="px-4 pb-24 text-center sm:px-6 lg:px-8">
        <Link
          href="/sign-up"
          className="btn-color-changing inline-flex h-12 items-center gap-2 rounded-[var(--radius-control)] px-7 text-sm"
        >
          Start tracking free
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
