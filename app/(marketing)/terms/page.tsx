export const metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of Clearledger.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-foreground">Terms of Service</h1>
      <p className="mt-4 text-sm text-foreground-muted">
        Clearledger is provided as-is for personal finance tracking. You are responsible for the
        accuracy of the data you enter and for keeping your credentials secure. Do not use the service
        for unlawful purposes. Availability is best-effort.
      </p>
      <p className="mt-4 text-sm text-foreground-muted">
        For questions, contact support at support@clearledger.example.
      </p>
      <p className="mt-8 text-xs text-foreground-muted">Last updated: 2026-09-24</p>
    </main>
  );
}