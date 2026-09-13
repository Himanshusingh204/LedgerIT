import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0">
        <Image
          src="/images/coffee-and-receipts-on-counter.jpg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-foreground/80" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Start your history today — see it on the dashboard in seconds.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base text-white/80">
          Free to start. No card required. Your first transaction takes less than a minute.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-white px-5 py-3 text-sm font-medium text-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Start tracking
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-white/30 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
