"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import type { Account, Category } from "@/types/database";

export function TransactionFilters({
  accounts,
  categories,
}: {
  accounts: Account[];
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <input
        type="search"
        placeholder="Search merchant…"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(event) => updateParam("search", event.target.value)}
        aria-label="Search transactions by merchant"
        className="h-10 w-full rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground placeholder:text-foreground-muted focus-visible:border-primary focus-visible:outline-none sm:w-52"
      />

      <select
        aria-label="Filter by type"
        defaultValue={searchParams.get("type") ?? ""}
        onChange={(event) => updateParam("type", event.target.value)}
        className="h-10 rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
      >
        <option value="">All types</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
        <option value="transfer">Transfer</option>
      </select>

      <select
        aria-label="Filter by account"
        defaultValue={searchParams.get("accountId") ?? ""}
        onChange={(event) => updateParam("accountId", event.target.value)}
        className="h-10 rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
      >
        <option value="">All accounts</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by category"
        defaultValue={searchParams.get("categoryId") ?? ""}
        onChange={(event) => updateParam("categoryId", event.target.value)}
        className="h-10 rounded-[var(--radius-control)] border border-border bg-surface px-3 text-sm text-foreground focus-visible:border-primary focus-visible:outline-none"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
