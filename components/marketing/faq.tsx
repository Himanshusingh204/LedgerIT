import { ChevronDown } from "lucide-react";

export const faqItems = [
  {
    q: "Is Clearledger really free?",
    a: "Yes. Unlimited transactions, accounts, and budgets are free, with no ads and no hidden tiers.",
  },
  {
    q: "Do I need to connect my bank?",
    a: "No. You log expenses yourself, so Clearledger never asks for bank logins or account numbers.",
  },
  {
    q: "Is my financial data secure?",
    a: "Every table uses Postgres row-level security, so each query can only return rows belonging to the signed-in user.",
  },
  {
    q: "Can I export my transactions?",
    a: "Yes. CSV export respects the filters you have active, so you can export just a date range, category, or account.",
  },
  {
    q: "Can I use it on my phone?",
    a: "Yes. It is a web app designed for mobile. Add it to your home screen from your browser for an app-style experience.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Questions, answered
      </h2>
      <div className="mt-10 divide-y divide-border overflow-hidden rounded-[var(--radius-surface-lg)] border border-border bg-surface">
        {faqItems.map((item) => (
          <details key={item.q} className="group px-5 py-4 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-foreground">
              {item.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-foreground-muted transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="mt-3 pr-8 text-sm leading-relaxed text-foreground-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
