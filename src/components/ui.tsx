import type { ReactNode } from "react";

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">{label}</p>
      <p className="font-display mt-1 text-2xl text-[var(--color-navy)]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-paper-raised)] px-6 py-12 text-center">
      <p className="font-display text-lg text-[var(--color-navy)]">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--color-ink-muted)]">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-md border border-[var(--color-rose)]/30 bg-[var(--color-rose-soft)] px-3 py-2 text-sm text-[var(--color-rose)]">
      {message}
    </p>
  );
}

export function DemoBadge({ label = "Demo data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
      {label}
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-[var(--color-emerald-soft)] text-[var(--color-emerald)]",
  DRAFT: "bg-[var(--color-slate-soft)] text-[var(--color-ink-muted)]",
  ARCHIVED: "bg-[var(--color-rose-soft)] text-[var(--color-rose)]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export function formatUsdCompact(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}
