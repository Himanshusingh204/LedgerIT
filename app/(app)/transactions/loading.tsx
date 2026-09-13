export default function TransactionsLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-48 rounded bg-surface-muted" />
      <div className="mt-6 h-10 w-full rounded bg-surface-muted" />
      <div className="mt-4 h-64 w-full rounded-[var(--radius-surface)] bg-surface-muted" />
    </div>
  );
}
