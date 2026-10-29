"use client";

import { useTransition } from "react";
import { expressInterestAction } from "@/lib/actions/listings";
import { Button } from "@/components/design-system/button";

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
    <Button disabled={isPending} onClick={() => startTransition(() => expressInterestAction(listingId))}>
      {isPending ? "Recording…" : "Express interest"}
    </Button>
  );
}
