"use client";

import { useTransition } from "react";
import { expressInterestAction } from "@/lib/actions/listings";

export function ExpressInterestButton({
  listingId,
  alreadyInterested,
}: {
  listingId: string;
  alreadyInterested: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (alreadyInterested) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md bg-[var(--color-emerald-soft)] px-4 py-2 text-sm font-medium text-[var(--color-emerald)]">
        ✓ Interest recorded
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => expressInterestAction(listingId))}
      className="rounded-md bg-[var(--color-navy)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-soft)] disabled:opacity-60"
    >
      {isPending ? "Recording…" : "Express interest"}
    </button>
  );
}
