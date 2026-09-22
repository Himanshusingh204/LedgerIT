"use client";

import {
  CalendarRange,
  Download,
  PieChart,
  ReceiptText,
  Wallet2,
  BellRing,
} from "lucide-react";
import { motion, type Variants } from "motion/react";

interface Feature {
  icon: React.ElementType;
  title: string;
  body: string;
  wide?: boolean;
  gradient: string;
  iconBg: string;
}

const FEATURES: Feature[] = [
  {
    icon: ReceiptText,
    title: "Full transaction ledger",
    body: "Search, filter, and paginate every expense, income, and transfer — with categories and accounts attached.",
    wide: true,
    gradient: "from-blue-500/10 via-blue-400/5 to-transparent",
    iconBg: "bg-blue-500/15 text-blue-600",
  },
  {
    icon: PieChart,
    title: "Category breakdowns",
    body: "See exactly which categories are eating the budget this month, ranked by real spend.",
    gradient: "from-blue-600/10 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-600/15 text-blue-700 dark:text-blue-400",
  },
  {
    icon: BellRing,
    title: "Budget warnings",
    body: "Categories that go over budget are flagged clearly, not buried in a table.",
    gradient: "from-amber-500/10 via-amber-400/5 to-transparent",
    iconBg: "bg-amber-500/15 text-amber-600",
  },
  {
    icon: Wallet2,
    title: "Multiple accounts",
    body: "Cash, bank, debit, or credit — track balances across every account you actually use.",
    gradient: "from-teal-500/10 via-teal-400/5 to-transparent",
    iconBg: "bg-teal-500/15 text-teal-600",
  },
  {
    icon: CalendarRange,
    title: "Flexible date ranges",
    body: "Week, month, quarter, or year — every chart and total respects the period you pick.",
    gradient: "from-slate-600/15 via-slate-500/5 to-transparent",
    iconBg: "bg-slate-600/15 text-slate-800 dark:text-slate-300",
  },
  {
    icon: Download,
    title: "CSV export",
    body: "Export the exact filtered view for taxes, records, or your own spreadsheet.",
    wide: true,
    gradient: "from-emerald-500/10 via-emerald-400/5 to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-600",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 1, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FeatureHighlights() {
  return (
    <section
      id="features"
      className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-14 max-w-2xl"
      >
        <p className="label-caps text-primary mb-3">Features</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Everything a household budget actually needs
        </h2>
        <p className="mt-4 text-base text-foreground-muted">
          No bank linking, no investment tracking, no gimmicks — just the tools that make
          tracking spending sustainable.
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
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            className={[
              "group relative overflow-hidden rounded-[var(--radius-surface-lg)] border border-border bg-surface p-6",
              "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
              feature.wide ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : "",
            ].join(" ")}
          >
            {/* Gradient splash on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              aria-hidden="true"
            />

            <div className="relative">
              {/* Icon */}
              <span
                className={`inline-grid h-10 w-10 place-items-center rounded-[var(--radius-control)] text-sm ${feature.iconBg}`}
              >
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <h3 className="mt-4 text-sm font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{feature.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
