import Image from "next/image";
import { Gauge, ShieldCheck, Target } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Gauge,
    title: "A dashboard that answers, not decorates",
    body: "Every number on the overview ties back to a real transaction — no vanity metrics, no filler charts.",
  },
  {
    icon: Target,
    title: "Budgets that actually track progress",
    body: "Set a monthly amount per category and see spent, remaining, and on-track status update as you go.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    body: "Row-level security means only you can ever read or edit your accounts, transactions, and budgets.",
  },
];

export function ValueProps() {
  return (
    <section id="why" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="order-2 overflow-hidden rounded-[var(--radius-surface-lg)] border border-border lg:order-1">
          <Image
            src="/images/calculator-and-budget-worksheet.jpg"
            alt="A calculator sitting on a handwritten budget worksheet with monthly totals circled"
            width={1024}
            height={603}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="order-1 lg:order-2">
          <h2 className="max-w-md text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built to be useful on a Tuesday night, not just a demo
          </h2>
          <div className="mt-10 space-y-8">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.title} className="flex gap-4">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-[var(--radius-control)] bg-surface-muted text-primary">
                  <prop.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{prop.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">{prop.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
