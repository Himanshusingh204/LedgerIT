import type { Metadata } from "next";
import { ShieldCheck, Lock, Download, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Security",
  description: "How Clearledger protects your financial data.",
};

const controls = [
  {
    icon: Lock,
    title: "Row-level security on every table",
    body: "Accounts, transactions, budgets and categories are readable and writable only by the account that owns them, enforced by the database rather than the app.",
  },
  {
    icon: ShieldCheck,
    title: "No bank credentials, ever",
    body: "Clearledger never asks for bank logins or account numbers. Everything in the ledger is entered by you.",
  },
  {
    icon: Download,
    title: "Export at any time",
    body: "CSV export of your transactions is available from the ledger, respecting the filters you set.",
  },
  {
    icon: Trash2,
    title: "Delete what you no longer need",
    body: "Delete any transaction you no longer need, and archive accounts you have stopped using.",
  },
];

export default function SecurityPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Your money data, protected where it is stored.
      </h1>
      <p className="mt-5 max-w-2xl text-pretty text-foreground-muted">
        Security is enforced in the database, not only in the interface. Here is what is in place today.
      </p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {controls.map(({ icon: Icon, title, body }) => (
          <li key={title} className="card-surface p-6">
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-12 text-sm text-foreground-muted">
        To report a security issue, see the project&apos;s SECURITY.md.
      </p>
    </main>
  );
}
