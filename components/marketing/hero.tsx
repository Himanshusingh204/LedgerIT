"use client";

import Link from "next/link";
import { ArrowRight, TrendingDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ── Animated counter hook ─────────────────────────────────── */
function useCounter(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [start, target, duration]);

  return count;
}

/* ── Dashboard mini mockup (floating card) ─────────────────── */
function DashboardMockup() {
  return (
    <div
      className="relative mx-auto w-full max-w-[480px] rounded-[var(--radius-surface-lg)] border border-white/20 bg-white/10 p-4 shadow-2xl"
      style={{ backdropFilter: "blur(20px) saturate(180%)" }}
      aria-hidden="true"
    >
      {/* Titlebar */}
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <span className="ml-3 text-xs font-medium text-white/60">Dashboard · September 2026</span>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Spent", value: "$2,148", delta: "+12%", neg: true },
          { label: "Income", value: "$5,200", delta: "+5%", neg: false },
          { label: "Net", value: "$3,052", delta: "+2%", neg: false },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-[var(--radius-surface)] bg-white/10 p-2.5"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">{kpi.label}</p>
            <p className="mt-0.5 text-base font-semibold text-white">{kpi.value}</p>
            <p className={`text-[10px] font-medium ${kpi.neg ? "text-red-300" : "text-emerald-300"}`}>
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Fake sparkline bars */}
      <div className="rounded-[var(--radius-surface)] bg-white/10 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Spending by category
        </p>
        <div className="space-y-1.5">
          {[
            { label: "Food & Dining", pct: 72, color: "bg-blue-400" },
            { label: "Transport", pct: 45, color: "bg-sky-400" },
            { label: "Shopping", pct: 31, color: "bg-teal-400" },
          ].map((bar) => (
            <div key={bar.label} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-[10px] text-white/60 truncate">{bar.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${bar.color}`}
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────── */
const STATS = [
  { value: 3, suffix: "", label: "questions answered every time you open it" },
  { value: 10, suffix: "s", label: "to log a new expense" },
  { value: 0, suffix: "", label: "spreadsheets required" },
];

export function Hero() {
  const shouldReduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c0 = useCounter(STATS[0].value, 800, inView);
  const c1 = useCounter(STATS[1].value, 1000, inView);
  const c2 = useCounter(STATS[2].value, 600, inView);
  const counts = [c0, c1, c2];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden gradient-mesh"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      {/* Decorative gradient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(36,82,235,0.22) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(48,43,99,0.30) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-12">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary mb-6">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
              Personal finance, without the spreadsheet
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl lg:leading-[1.05]">
              Know where your{" "}
              <span className="gradient-text">money</span> is going.
            </h1>

            {/* Sub */}
            <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground-muted sm:text-lg">
              Track everyday spending, understand your habits, and make the next decision with
              confidence — in a dashboard built for real life, not accounting software.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/sign-up"
                id="hero-cta-signup"
                className="btn-color-changing inline-flex items-center gap-2 rounded-[var(--radius-control)] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Start tracking — it&apos;s free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                id="hero-cta-how"
                className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                See how it works
              </a>
            </div>

            {/* Animated stats */}
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {STATS.map((stat, i) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-bold text-foreground sm:text-3xl">
                    {i === 1 ? "<" : ""}
                    {shouldReduce ? stat.value : counts[i]}
                    {stat.suffix}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-foreground-muted font-medium">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Right — floating mockup */}
          <motion.div
            initial={{ opacity: 1, x: 0, scale: 1 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            {/* Glow behind card */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-[var(--radius-surface-lg)]"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(36,82,235,0.20) 0%, transparent 70%)",
                filter: "blur(32px)",
                transform: "scale(1.15)",
              }}
            />
            {/* Floating badge */}
            <motion.div
              animate={shouldReduce ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 z-10 flex items-center gap-1.5 rounded-[var(--radius-control)] border border-success/30 bg-surface px-3 py-2 shadow-md text-xs font-semibold text-success"
            >
              <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              Budget on track
            </motion.div>
            {/* Dashboard card */}
            <div
              className="rounded-[var(--radius-surface-lg)] p-3"
              style={{
                background: "linear-gradient(135deg, #24243e 0%, #302b63 50%, #1d4ed8 100%)",
              }}
            >
              <DashboardMockup />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, var(--background))" }}
      />
    </section>
  );
}


