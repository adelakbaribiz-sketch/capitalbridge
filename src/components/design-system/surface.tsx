import type { HTMLAttributes } from "react";

// Spatial depth system: Background (paper) → Surface → Elevated → Floating → Modal.
// Applied semantically (hero stats, primary panels), not to every card —
// see docs/DESIGN_SYSTEM.md. Shadow tokens live in globals.css so light/dark
// stay in sync automatically.

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function Surface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] shadow-[var(--shadow-raised)]",
        className,
      )}
      {...props}
    />
  );
}

/** One level up: hero stats, primary summary panels — the thing the eye should land on first. */
export function ElevatedSurface({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-paper-raised)] shadow-[var(--shadow-elevated)] transition-shadow duration-[var(--motion-base)]",
        className,
      )}
      {...props}
    />
  );
}

/** Detached from the page: dropdowns, popovers, drag-preview-style cards. Use sparingly. */
export function FloatingCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-paper-raised)] shadow-[var(--shadow-floating)]",
        className,
      )}
      {...props}
    />
  );
}
