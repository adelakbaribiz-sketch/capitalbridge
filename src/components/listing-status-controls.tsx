"use client";

import { useTransition } from "react";
import { setListingStatusAction } from "@/lib/actions/listings";
import { Button } from "@/components/design-system/button";

export function ListingStatusControls({ listingId, status }: { listingId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  const set = (next: "PUBLISHED" | "DRAFT" | "ARCHIVED") =>
    startTransition(() => setListingStatusAction(listingId, next));

  return (
    <div className="flex gap-2">
      {status !== "PUBLISHED" && (
        <Button variant="secondary" size="sm" disabled={isPending} onClick={() => set("PUBLISHED")}>
          Publish
        </Button>
      )}
      {status === "PUBLISHED" && (
        <Button variant="secondary" size="sm" disabled={isPending} onClick={() => set("DRAFT")}>
          Unpublish
        </Button>
      )}
      {status !== "ARCHIVED" && (
        <Button variant="secondary" size="sm" disabled={isPending} onClick={() => set("ARCHIVED")}>
          Archive
        </Button>
      )}
    </div>
  );
}
