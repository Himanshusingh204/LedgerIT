"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { RangeKey } from "@/lib/finance/date-range";

const RANGES: { value: RangeKey; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

export function RangeSelector({ current }: { current: RangeKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function selectRange(range: RangeKey) {
    const params = new URLSearchParams(searchParams);
    params.set("range", range);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="inline-flex rounded-[var(--radius-control)] border border-border bg-surface p-1">
      {RANGES.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => selectRange(option.value)}
          aria-pressed={current === option.value}
          className={`rounded-[calc(var(--radius-control)-2px)] px-3 py-1.5 text-sm font-medium transition-colors ${
            current === option.value
              ? "bg-primary text-primary-foreground"
              : "text-foreground-muted hover:text-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
