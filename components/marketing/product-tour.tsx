"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const tour = [
  {
    image: "/images/product-transactions.png",
    alt: "Transactions ledger with search, filters and categorised entries",
    title: "A ledger that keeps up with you",
    body: "Search, filter by category or account, and edit any entry in place. Every row is yours and exports to CSV.",
  },
  {
    image: "/images/product-budgets.png",
    alt: "Monthly budget view with progress against each category limit",
    title: "Budgets you can actually see",
    body: "Set a monthly cap per category and watch progress update as you spend. Move between months to compare.",
  },
];

export function ProductTour() {
  const reduce = useReducedMotion();
  return (
    <section id="product" className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      {tour.map((item, i) => (
        <motion.div
          key={item.title}
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-16 ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}
        >
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-[var(--radius-surface-lg)] border border-border bg-surface shadow-[var(--shadow-card)]">
              <Image src={item.image} alt={item.alt} width={1440} height={900} sizes="(min-width: 1024px) 58vw, 100vw" className="h-auto w-full" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{item.title}</h2>
            <p className="mt-4 max-w-prose text-pretty leading-relaxed text-foreground-muted">{item.body}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
