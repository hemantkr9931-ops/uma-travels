export default function Loading() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block w-10 h-10 rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-gold-400)] animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm text-[var(--color-text-muted)]">Loading…</p>
    </div>
  );
}
