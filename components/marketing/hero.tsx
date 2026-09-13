import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { ProductCarousel } from "@/components/marketing/product-carousel";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted">
            Personal finance, without the spreadsheet
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Know where your money is going.
          </h1>
          <p className="mt-5 max-w-lg text-base text-foreground-muted sm:text-lg">
            Track everyday spending, understand your habits, and make the next decision with
            confidence — in a dashboard built for real life, not accounting software.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Start tracking
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              <PlayCircle className="h-4 w-4" />
              See how it works
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
            {[
              { dt: "3", dd: "questions it answers every time you open it" },
              { dt: "<10s", dd: "to log a new expense" },
              { dt: "0", dd: "spreadsheets required" },
            ].map((stat) => (
              <div key={stat.dd}>
                <dt className="text-2xl font-semibold text-foreground">{stat.dt}</dt>
                <dd className="mt-1 text-xs leading-snug text-foreground-muted">{stat.dd}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ProductCarousel />
        </div>
      </div>
    </section>
  );
}
