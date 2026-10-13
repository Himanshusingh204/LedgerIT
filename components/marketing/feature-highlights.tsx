"use client";

import { BarChart3, FileDown, PiggyBank, Receipt, ShieldCheck, Wallet, Tags, Paperclip } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  body: string;
  icon: typeof Receipt;
  span: string;
  visual?: ReactNode;
  tinted?: boolean;
};

const features: Feature[] = [
  {
    title: "Log an expense in seconds",
    body: "Amount, category, account, done. The ledger stays fast even with years of history.",
    icon: Receipt,
    span: "md:col-span-2 md:row-span-2",
    tinted: true,
    visual: (
      <div className="mt-8 space-y-2.5" aria-hidden="true">
        {["Coffee · Dining", "Monthly transit pass · Transport", "Weekly groceries · Groceries"].map((t, i) => (
          <div
            key={t}
            className="flex items-center justify-between rounded-xl border border-border bg-surface-muted/60 px-4 py-3 text-sm"
            style={{ transform: `translateX(${i * 10}px)` }}
          >
            <span className="text-foreground-muted">{t}</span>
            <span className="text-num text-foreground">-${[4.8, 96, 142.3][i]}</span>
          </div>
        ))}
      </div>
    ),
  },
  { title: "Budgets that move with you", body: "Set a monthly limit per category and watch progress update as you spend.", icon: PiggyBank, span: "" },
  { title: "Every account, one view", body: "Cash, cards, and savings in one place with balances that stay in sync.", icon: Wallet, span: "" },
  { title: "Spending analytics", body: "Trends, category breakdowns, and your top merchants, by any date range.", icon: BarChart3, span: "md:col-span-2" },
  { title: "Smart categories", body: "Built-in categories you can rename, recolour, or extend to match how you spend.", icon: Tags, span: "" },
  { title: "Receipts attached", body: "Keep a photo next to the expense it belongs to. Stored privately, shown only to you.", icon: Paperclip, span: "" },
  { title: "Export any time", body: "CSV export respects your current filters, so tax prep takes minutes.", icon: FileDown, span: "" },
  { title: "Private by design", body: "Row-level security on every table means no one else can read your data, including us.", icon: ShieldCheck, span: "md:col-span-2", tinted: true },
];

function Card({ f, index }: { f: Feature; index: number }) {
  const reduce = useReducedMotion();
  const Icon = f.icon;
  return (
    <motion.article
      className={`card-surface group relative overflow-hidden p-6 transition-colors hover:border-primary/40 sm:p-7 ${f.span} ${f.tinted ? "bg-primary-subtle/60" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60"
        aria-hidden="true"
      />
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="relative mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-foreground-muted">{f.body}</p>
      {f.visual ? <div className="relative">{f.visual}</div> : null}
    </motion.article>
  );
}

export function FeatureHighlights() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="max-w-2xl">
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          What is inside
        </h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-4 md:auto-rows-[minmax(14rem,auto)]">
        {features.map((f, i) => (
          <Card key={f.title} f={f} index={i} />
        ))}
      </div>
    </section>
  );
}
