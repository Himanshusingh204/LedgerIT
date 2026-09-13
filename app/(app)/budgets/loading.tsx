export default function BudgetsLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-40 rounded bg-surface-muted" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-20 rounded-[var(--radius-surface)] bg-surface-muted" />
        ))}
      </div>
    </div>
  );
}
