"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

function shiftMonth(monthStart: string, delta: number): string {
  const [year, month] = monthStart.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export function MonthSelector({ monthStart }: { monthStart: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToMonth(next: string) {
    const params = new URLSearchParams(searchParams);
    params.set("month", next);
    router.push(`${pathname}?${params.toString()}`);
  }

  const label = new Date(`${monthStart}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface p-1">
      <button
        type="button"
        onClick={() => goToMonth(shiftMonth(monthStart, -1))}
        aria-label="Previous month"
        className="grid h-8 w-8 place-items-center rounded-[calc(var(--radius-control)-2px)] text-foreground-muted hover:bg-surface-muted hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="min-w-[9rem] text-center text-sm font-medium text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => goToMonth(shiftMonth(monthStart, 1))}
        aria-label="Next month"
        className="grid h-8 w-8 place-items-center rounded-[calc(var(--radius-control)-2px)] text-foreground-muted hover:bg-surface-muted hover:text-foreground"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
