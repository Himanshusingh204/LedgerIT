import Image from "next/image";
import { PlusCircle, LayoutDashboard, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: PlusCircle,
    step: "01",
    title: "Add what you spend",
    body: "Log an expense or income entry in seconds — amount, category, account, done.",
  },
  {
    icon: LayoutDashboard,
    step: "02",
    title: "Watch the dashboard update",
    body: "Totals, trends, and category breakdowns refresh instantly from your real transaction history.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Decide what's next",
    body: "See which budgets are on track, which merchants add up, and where to cut back this month.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <h2 className="max-w-md text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Three steps, every time
          </h2>
          <ol className="mt-10 space-y-8">
            {STEPS.map((step) => (
              <li key={step.step} className="flex gap-4">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-border bg-background text-sm font-semibold text-foreground-muted">
                  {step.step}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <step.icon className="h-4 w-4 text-primary" />
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-surface-lg)] border border-border">
          <Image
            src="/images/stack-of-shopping-receipts.jpg"
            alt="A stack of paper receipts waiting to be logged as expenses"
            width={1024}
            height={683}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
