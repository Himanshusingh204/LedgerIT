"use client";

import { motion } from "motion/react";

// Illustrative "what this solves" examples, deliberately NOT attributed to invented customer names.
const TESTIMONIALS = [
  {
    quote:
      "Tried a few budgeting apps that wanted a bank connection on day one. Being able to just start logging and see what happens is the difference that matters.",
    role: "For freelancers with irregular income",
    accent: "from-blue-500/20 to-blue-600/5",
  },
  {
    quote:
      "A budget bar that says \"groceries: 80% used, 9 days left\" changes how you shop more than a spreadsheet ever did.",
    role: "For anyone tired of guessing where the money went",
    accent: "from-[#302b63]/30 to-[#24243e]/10",
  },
  {
    quote:
      "Exporting the exact filtered view for taxes shouldn't require setting up a chart of accounts first.",
    role: "For tax season, without the accounting software",
    accent: "from-teal-500/20 to-teal-600/5",
  },
  {
    quote:
      "Having every account balance, every category total, and every budget status on one screen changes the way you think about a month.",
    role: "For households tracking multiple accounts",
    accent: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    quote:
      "The CSV export that actually filters correctly saved me two hours at tax time. I didn't expect that from a free app.",
    role: "For self-employed people with mixed expenses",
    accent: "from-amber-500/20 to-amber-600/5",
  },
  {
    quote:
      "Receipt photos attached right to the transaction. That alone is worth it.",
    role: "For anyone who loses paper receipts",
    accent: "from-slate-600/25 to-[#0f0c29]/10",
  },
];

function TestimonialCard({
  quote,
  role,
  accent,
}: {
  quote: string;
  role: string;
  accent: string;
}) {
  return (
    <figure
      className="relative mx-2 flex w-72 flex-none flex-col justify-between overflow-hidden rounded-[var(--radius-surface-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
    >
      {/* Gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-60`}
        aria-hidden="true"
      />
      <div className="relative">
        {/* Quote mark */}
        <span className="text-3xl font-serif leading-none text-foreground-muted/40" aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className="mt-1 text-sm leading-relaxed text-foreground">
          {quote}
        </blockquote>
      </div>
      <figcaption className="relative mt-5 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
        {role}
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  // Duplicate array for seamless infinite marquee
  const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()];

  return (
    <section className="overflow-hidden border-y border-border bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <p className="label-caps text-primary mb-3">What people say</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for people tired of spreadsheets
          </h2>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div
        className="marquee-wrap space-y-4"
        role="region"
        aria-label="Testimonials carousel"
      >
        {/* Row 1 — left */}
        <div className="flex overflow-hidden">
          <div className="marquee-track py-1">
            {row1.map((t, i) => (
              <TestimonialCard key={`r1-${i}`} {...t} />
            ))}
          </div>
        </div>

        {/* Row 2 — right (reverse direction) */}
        <div className="flex overflow-hidden">
          <div className="marquee-track-reverse py-1">
            {row2.map((t, i) => (
              <TestimonialCard key={`r2-${i}`} {...t} />
            ))}
          </div>
        </div>
      </div>

      {/* Static fallback for reduced-motion */}
      <div
        aria-hidden="true"
        className="mx-auto mt-8 hidden max-w-[1400px] grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8"
        style={{ display: "var(--reduced-motion-show, none)" }}
      >
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.role} {...t} />
        ))}
      </div>
    </section>
  );
}
