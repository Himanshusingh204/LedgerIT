"use client";

import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";

export function ExportButton() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.delete("page");

  return (
    <a
      href={`/transactions/export?${params.toString()}`}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface px-4 text-sm font-medium text-foreground hover:bg-surface-muted"
    >
      <Download className="h-4 w-4" aria-hidden />
      Export CSV
    </a>
  );
}
