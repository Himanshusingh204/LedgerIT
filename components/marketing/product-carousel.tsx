"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardMockup, TransactionMockup, BudgetMockup, AnalyticsMockup } from "@/components/marketing/mockup-screens";

const SLIDES = [
  {
    title: "See the whole picture",
    caption: "Totals, income, and net change for the period you choose — no spreadsheet required.",
    Screen: DashboardMockup,
  },
  {
    title: "Log an expense in seconds",
    caption: "Amount, category, account — add it before you've left the checkout line.",
    Screen: TransactionMockup,
  },
  {
    title: "Set a budget, see it hold",
    caption: "Every category shows spent, remaining, and whether it's on track.",
    Screen: BudgetMockup,
  },
  {
    title: "Understand your habits",
    caption: "Compare months, spot your top merchants, and catch trends early.",
    Screen: AnalyticsMockup,
  },
] as const;

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 60;

export function ProductCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const id = setInterval(() => {
      setDirection(1);
      goNext();
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, shouldReduceMotion, goNext]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      setDirection(1);
      goNext();
    } else if (event.key === "ArrowLeft") {
      setDirection(-1);
      goPrev();
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      setDirection(1);
      goNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      setDirection(-1);
      goPrev();
    }
  };

  const slide = SLIDES[index];

  return (
    <div
      className="w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Product preview"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        className="relative aspect-[4/3] w-full max-w-xl overflow-hidden sm:aspect-[16/11]"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? 48 : -48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? -48 : 48 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            drag={shouldReduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0"
          >
            <slide.Screen />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 sm:mt-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground sm:text-base">{slide.title}</p>
          <p className="mt-1 text-sm text-foreground-muted">{slide.caption}</p>
        </div>
        <div className="flex flex-none items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setDirection(-1);
              goPrev();
            }}
            aria-label="Previous slide"
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDirection(1);
              goNext();
            }}
            aria-label="Next slide"
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex" role="tablist" aria-label="Choose slide">
        {SLIDES.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show slide ${i + 1}: ${s.title}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className="grid h-6 w-6 flex-none place-items-center"
          >
            <span
              aria-hidden
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
            />
          </button>
        ))}
      </div>

      <div ref={liveRegionRef} className="sr-only" aria-live="polite">
        {`Slide ${index + 1} of ${SLIDES.length}: ${slide.title}`}
      </div>
    </div>
  );
}
