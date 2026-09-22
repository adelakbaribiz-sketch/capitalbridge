import Link from "next/link";
import { decodeList } from "@/lib/json-list";
import { stageLabel, raiseTypeLabel } from "@/lib/taxonomy";
import { formatUsdCompact } from "@/components/ui";
import { MatchBadge } from "@/components/match-badge";
import type { MatchResult } from "@/lib/match";

export type ListingCardData = {
  id: string;
  companyName: string;
  tagline: string;
  sectorTier1: string;
  sectorTier2Json: string;
  stage: string;
  raiseType: string;
  askAmountUsd: number;
  geography: string;
};

export function ListingCard({ listing, match }: { listing: ListingCardData; match?: MatchResult }) {
  const tier2 = decodeList(listing.sectorTier2Json).slice(0, 2);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex h-full flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5 transition hover:border-[var(--color-navy)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg text-[var(--color-navy)] group-hover:underline">
            {listing.companyName}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{listing.tagline}</p>
        </div>
        {match && <MatchBadge score={match.score} band={match.band} />}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-[var(--color-slate-soft)] px-2 py-0.5 text-xs text-[var(--color-ink-muted)]">
          {listing.sectorTier1}
        </span>
        {tier2.map((t) => (
          <span key={t} className="rounded-full bg-[var(--color-slate-soft)] px-2 py-0.5 text-xs text-[var(--color-ink-muted)]">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-5 text-sm">
        <div>
          <p className="text-xs text-[var(--color-ink-muted)]">Stage</p>
          <p className="font-medium text-[var(--color-ink)]">{stageLabel(listing.stage)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-ink-muted)]">Raising</p>
          <p className="font-medium text-[var(--color-ink)]">{formatUsdCompact(listing.askAmountUsd)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-ink-muted)]">Instrument</p>
          <p className="font-medium text-[var(--color-ink)]">{raiseTypeLabel(listing.raiseType)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-ink-muted)]">Geography</p>
          <p className="font-medium text-[var(--color-ink)]">{listing.geography}</p>
        </div>
      </div>
    </Link>
  );
}
