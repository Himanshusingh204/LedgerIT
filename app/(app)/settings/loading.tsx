export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-40 rounded bg-surface-muted" />
      <div className="mt-6 h-64 rounded-[var(--radius-surface)] bg-surface-muted" />
      <div className="mt-4 h-40 rounded-[var(--radius-surface)] bg-surface-muted" />
    </div>
  );
}
