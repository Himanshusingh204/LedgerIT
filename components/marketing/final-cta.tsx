import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
      <div className="card-glass grain-overlay relative mx-auto max-w-5xl overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[100px]" aria-hidden="true" />
        <h2 className="relative text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          See where your money went this month.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-pretty text-foreground-muted">
          Start in under a minute. No card, no bank login, nothing to install.
        </p>
        <div className="relative mt-8 flex justify-center">
          <Link
            href="/sign-up"
            className="btn-color-changing sheen relative inline-flex h-12 items-center gap-2 rounded-[var(--radius-control)] px-7 text-sm"
          >
            Create free account
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
