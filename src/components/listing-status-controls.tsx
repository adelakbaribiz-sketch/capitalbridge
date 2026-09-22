"use client";

import { useTransition } from "react";
import { setListingStatusAction } from "@/lib/actions/listings";

const btnClass =
  "rounded-md border border-[var(--color-border)] px-2.5 py-1 text-xs font-medium text-[var(--color-ink)] transition hover:border-[var(--color-navy)] disabled:opacity-50";

export function ListingStatusControls({ listingId, status }: { listingId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  const set = (next: "PUBLISHED" | "DRAFT" | "ARCHIVED") =>
    startTransition(() => setListingStatusAction(listingId, next));

  return (
    <div className="flex gap-2">
      {status !== "PUBLISHED" && (
        <button type="button" disabled={isPending} onClick={() => set("PUBLISHED")} className={btnClass}>
          Publish
        </button>
      )}
      {status === "PUBLISHED" && (
        <button type="button" disabled={isPending} onClick={() => set("DRAFT")} className={btnClass}>
          Unpublish
        </button>
      )}
      {status !== "ARCHIVED" && (
        <button type="button" disabled={isPending} onClick={() => set("ARCHIVED")} className={btnClass}>
          Archive
        </button>
      )}
    </div>
  );
}
