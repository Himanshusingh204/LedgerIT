"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function FinalCta() {
  return (
    <section
      className="relative overflow-hidden grain-overlay"
      style={{
        backgroundColor: "#0f0c29",
        backgroundImage: "linear-gradient(135deg, #24243e 0%, #302b63 50%, #0f0c29 100%)",
      }}
    >
      {/* Decorative midnight orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 right-0 h-64 w-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-1/4 h-56 w-56 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(48,43,99,0.45) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />

      <motion.div
        initial={{ opacity: 1, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-[1400px] px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8"
      >
        <p className="label-caps mb-4 text-white/80 font-semibold tracking-wider">Ready to start?</p>
        <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Start your history today — see it on the dashboard in seconds.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base text-white/90">
          Free to start. No card required. Your first transaction takes less than a minute.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/sign-up"
            id="final-cta-signup"
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] bg-white px-6 py-3.5 text-sm font-bold text-[#0f0c29] shadow-lg transition-all hover:opacity-95 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0c29]"
          >
            Start tracking — it&apos;s free
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/sign-in"
            id="final-cta-signin"
            className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-white/40 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0c29]"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
