"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";

/* Real product screenshot, tilted in 3D by pointer position. Tilt is motion values only (no state). */
function ProductFrame() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [0, 1], [-6, 6]);
  const rotateX = useTransform(sy, [0, 1], [4, -4]);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <div className="scene-3d relative mx-auto w-full max-w-[640px]" onMouseMove={onMove} onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}>
      <motion.div
        style={reduce ? undefined : { rotateX, rotateY }}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-[var(--radius-surface-lg)] border border-border bg-surface shadow-[var(--shadow-card-hover)]"
      >
        <Image
          src="/images/product-dashboard.png"
          alt="Clearledger dashboard showing income, expenses, budget progress and recent transactions"
          width={1440}
          height={900}
          priority
          sizes="(min-width: 1024px) 640px, 100vw"
          className="h-auto w-full"
        />
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="gradient-mesh relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Free. No ads. No bank login.
          </span>

          <h1 className="mt-6 text-balance text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]">
            Money, <span className="gradient-text">finally clear.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground-muted sm:text-lg">
            Log an expense in seconds and see exactly where your money goes. Private by default.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="btn-color-changing sheen relative inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] px-6 text-sm"
            >
              Start tracking free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#product"
              className="inline-flex h-12 items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface px-6 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
            >
              See it in action
            </Link>
          </div>
        </motion.div>

        <ProductFrame />
      </div>
    </section>
  );
}
