import { EyeOff, Feather, Scale } from "lucide-react";

const principles = [
  {
    icon: Feather,
    title: "Fast over clever",
    body: "No guessing and no forced setup. You enter what you spent, and the totals are just the sum of that.",
  },
  {
    icon: EyeOff,
    title: "Private by default",
    body: "Each account can only read its own records, enforced by the database. We do not sell data or show ads.",
  },
  {
    icon: Scale,
    title: "Yours to take with you",
    body: "Export every transaction to CSV at any time. If you leave, you take your records with you.",
  },
];

export function Principles() {
  return (
    <section id="principles" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          How we handle your data
        </h2>
        <ul className="divide-y divide-border border-y border-border">
          {principles.map(({ icon: Icon, title, body }) => (
            <li key={title} className="grid gap-4 py-7 sm:grid-cols-[auto_1fr] sm:gap-6">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-foreground-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
