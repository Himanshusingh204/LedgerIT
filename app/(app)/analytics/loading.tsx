export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-40 rounded bg-surface-muted" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-[var(--radius-surface)] bg-surface-muted" />
        <div className="h-24 rounded-[var(--radius-surface)] bg-surface-muted" />
        <div className="h-24 rounded-[var(--radius-surface)] bg-surface-muted" />
      </div>
      <div className="mt-4 h-64 rounded-[var(--radius-surface)] bg-surface-muted" />
    </div>
  );
}
