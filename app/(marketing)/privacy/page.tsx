export const metadata = {
  title: "Privacy Policy",
  description: "How Clearledger collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 prose prose-sm dark:prose-invert">
      <h1 className="text-2xl font-semibold text-foreground">Privacy Policy</h1>
      <p className="mt-4 text-sm text-foreground-muted">
        Clearledger stores only the data you submit. Your transactions, accounts, budgets, and
        categories are isolated per user with row-level security in Supabase Postgres. We do not sell
        personal data or connect to banks. You can export your data to CSV at any time.
      </p>
      <h2 className="mt-8 text-lg font-semibold text-foreground">Data we store</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-foreground-muted">
        <li>Account email and profile preferences (name, currency, timezone)</li>
        <li>Accounts, transactions, categories, budgets you create</li>
        <li>Optional receipt images uploaded to a private per-user bucket</li>
        <li>Cookie session data needed to keep you signed in</li>
      </ul>
      <h2 className="mt-8 text-lg font-semibold text-foreground">Cookies</h2>
      <p className="mt-2 text-sm text-foreground-muted">
        Clearledger uses essential cookies for authentication only. No tracking or analytics cookies
        are set unless you explicitly opt in. See the <a href="/cookies" className="text-primary underline">Cookie Policy</a>.
      </p>
      <p className="mt-8 text-xs text-foreground-muted">Last updated: 2026-09-24</p>
    </main>
  );
}