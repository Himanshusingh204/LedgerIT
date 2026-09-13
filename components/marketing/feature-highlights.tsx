import { CalendarRange, Download, PieChart, ReceiptText, Wallet2, BellRing } from "lucide-react";

const FEATURES = [
  {
    icon: ReceiptText,
    title: "Full transaction ledger",
    body: "Search, filter, and paginate every expense, income, and transfer — with categories and accounts attached.",
  },
  {
    icon: PieChart,
    title: "Category breakdowns",
    body: "See exactly which categories are eating the budget this month, ranked by real spend.",
  },
  {
    icon: Wallet2,
    title: "Multiple accounts",
    body: "Cash, bank, debit, or credit — track balances across every account you actually use.",
  },
  {
    icon: CalendarRange,
    title: "Flexible date ranges",
    body: "Week, month, quarter, or year — every chart and total respects the period you pick.",
  },
  {
    icon: BellRing,
    title: "Budget warnings",
    body: "Categories that go over budget are flagged clearly, not buried in a table.",
  },
  {
    icon: Download,
    title: "CSV export",
    body: "Export the exact filtered view you're looking at for taxes, records, or your own spreadsheet.",
  },
];

export function FeatureHighlights() {
  return (
    <section id="features" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="max-w-xl">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything a household budget actually needs
        </h2>
        <p className="mt-4 text-base text-foreground-muted">
          No bank linking, no investment tracking, no gimmicks — just the tools that make tracking
          spending sustainable.
        </p>
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="border-t border-border pt-5">
            <feature.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-4 text-sm font-semibold text-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
