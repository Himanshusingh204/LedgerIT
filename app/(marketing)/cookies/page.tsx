export const metadata = {
  title: "Cookie Policy",
  description: "How Clearledger uses cookies.",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-foreground">Cookie Policy</h1>
      <p className="mt-4 text-sm text-foreground-muted">
        Essential cookies keep your session alive after you sign in. Optional analytics cookies are
        disabled by default and only enabled after explicit consent. You can clear cookies at any time
        through your browser.
      </p>
      <p className="mt-8 text-xs text-foreground-muted">Last updated: 2026-09-24</p>
    </main>
  );
}