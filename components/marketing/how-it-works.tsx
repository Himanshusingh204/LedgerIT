"use client";

import Image from "next/image";
import { PlusCircle, LayoutDashboard, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    icon: PlusCircle,
    step: "01",
    title: "Add what you spend",
    body: "Log an expense or income entry in seconds — amount, category, account, done.",
    color: "bg-blue-700",
  },
  {
    icon: LayoutDashboard,
    step: "02",
    title: "Watch the dashboard update",
    body: "Totals, trends, and category breakdowns refresh instantly from your real transaction history.",
    color: "bg-[#302b63] border border-white/20",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Decide what's next",
    body: "See which budgets are on track, which merchants add up, and where to cut back this month.",
    color: "bg-emerald-700",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border bg-surface"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-24 lg:grid lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">

        {/* Left — stepper */}
        <div>
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="label-caps text-primary mb-3">How it works</p>
            <h2 className="max-w-md text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Three steps, every time
            </h2>
          </motion.div>

          {/* Steps with connecting line */}
          <div className="relative mt-12">
            {/* Vertical connector line */}
            <div
              aria-hidden="true"
              className="absolute left-5 top-8 bottom-8 w-px bg-border"
              style={{ marginLeft: "-0.5px" }}
            />

            <ol className="relative space-y-10">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.step}
                  initial={{ opacity: 1, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
                  className="flex gap-5"
                >
                  {/* Step indicator */}
                  <div className="relative flex-none">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full text-white text-sm font-bold shadow-md ${step.color}`}
                    >
                      {step.step}
                    </span>
                  </div>

                  <div className="pb-2 pt-1.5">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                      <step.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right — image */}
        <motion.div
          initial={{ opacity: 1, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-12 overflow-hidden rounded-[var(--radius-surface-lg)] border border-border lg:mt-0"
        >
          <Image
            src="/images/stack-of-shopping-receipts.jpg"
            alt="A stack of paper receipts waiting to be logged as expenses"
            width={640}
            height={480}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
