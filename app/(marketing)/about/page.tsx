import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Why Clearledger exists and how it approaches your money.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8">
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Why we built Clearledger
      </h1>
      <div className="mt-8 space-y-5 text-pretty leading-relaxed text-foreground-muted">
        <p>
          Most finance apps ask for your bank login, a subscription, or a lot of your attention. Clearledger
          asks for none of those. You write down what you spent, and it shows you where the money went.
        </p>
        <p>
          The app is deliberately simple: a ledger you can search, budgets you can check at a glance, your
          accounts, and charts built only from what you entered.
        </p>
        <p>
          Your data belongs to you. Every table is protected by row-level security, so each account can only
          read its own records. You can export everything to CSV at any time.
        </p>
      </div>
    </main>
  );
}
