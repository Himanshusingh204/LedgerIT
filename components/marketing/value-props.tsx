"use client";

import Image from "next/image";
import { Gauge, ShieldCheck, Target, ArrowRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";

const VALUE_PROPS = [
  {
    icon: Gauge,
    title: "A dashboard that answers, not decorates",
    body: "Every number on the overview ties back to a real transaction — no vanity metrics, no filler charts.",
    color: "from-blue-500/15 to-blue-600/5",
    iconColor: "text-blue-600",
  },
  {
    icon: Target,
    title: "Budgets that actually track progress",
    body: "Set a monthly amount per category and see spent, remaining, and on-track status update as you go.",
    color: "from-slate-600/20 to-slate-800/10",
    iconColor: "text-slate-700 dark:text-slate-300",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    body: "Row-level security means only you can ever read or edit your accounts, transactions, and budgets.",
    color: "from-teal-500/15 to-teal-600/5",
    iconColor: "text-teal-600",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 1, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function ValueProps() {
  return (
    <section id="why" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-14 max-w-2xl"
      >
        <p className="label-caps text-primary mb-3">Why Clearledger</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Built to be useful on a{" "}
          <span className="gradient-text">Tuesday night</span>, not just a demo
        </h2>
        <p className="mt-4 text-base text-foreground-muted">
          The tools that actually matter when you sit down to review a month of spending.
        </p>
      </motion.div>

      {/* Bento grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* Large photo card — spans 2 rows on lg */}
        <motion.div
          variants={cardVariants}
          className="overflow-hidden rounded-[var(--radius-surface-lg)] border border-border lg:row-span-2"
          style={{ minHeight: "340px" }}
        >
          <Image
            src="/images/calculator-and-budget-worksheet.jpg"
            alt="A calculator sitting on a handwritten budget worksheet with monthly totals circled"
            width={600}
            height={700}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Value prop cards */}
        {VALUE_PROPS.map((prop) => (
          <motion.div
            key={prop.title}
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[var(--radius-surface-lg)] border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
          >
            {/* Gradient background on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${prop.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              aria-hidden="true"
            />
            <div className="relative">
              <span className="inline-grid h-10 w-10 place-items-center rounded-[var(--radius-control)] bg-surface-muted transition-colors group-hover:bg-white/60">
                <prop.icon className={`h-5 w-5 ${prop.iconColor}`} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{prop.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{prop.body}</p>
            </div>
          </motion.div>
        ))}

        {/* CTA card */}
        <motion.div
          variants={cardVariants}
          className="relative overflow-hidden rounded-[var(--radius-surface-lg)] p-6 text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div aria-hidden="true" className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div aria-hidden="true" className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/8" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Ready to start?</p>
            <p className="mt-2 text-lg font-bold leading-snug">
              Your first transaction takes less than a minute.
            </p>
            <Link
              href="/sign-up"
              id="value-props-cta"
              className="mt-4 inline-flex items-center gap-1.5 rounded-[var(--radius-control)] bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Get started free
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
