import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { decodeList } from "@/lib/json-list";
import { computeMatchScore } from "@/lib/match";
import { SECTOR_TIER1, STAGES, GEOGRAPHIES } from "@/lib/taxonomy";
import { ListingCard } from "@/components/listing-card";
import { EmptyState } from "@/components/ui";
import type { Prisma } from "@prisma/client";

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const session = await getSession();

  const where: Prisma.ListingWhereInput = { status: "PUBLISHED" };
  if (params.sector) where.sectorTier1 = params.sector;
  if (params.stage) where.stage = params.stage as never;
  if (params.geography) where.geography = params.geography;
  if (params.q) {
    where.OR = [
      { companyName: { contains: params.q } },
      { tagline: { contains: params.q } },
      { description: { contains: params.q } },
    ];
  }

  const listings = await prisma.listing.findMany({ where, orderBy: { createdAt: "desc" } });

  let investorProfile = null;
  if (session?.role === "INVESTOR") {
    investorProfile = await prisma.investorProfile.findUnique({ where: { userId: session.userId } });
  }

  const withMatch = listings.map((listing) => ({
    listing,
    match: investorProfile
      ? computeMatchScore({
          investor: {
            sectors: decodeList(investorProfile.sectorsJson),
            stages: decodeList(investorProfile.stagesJson),
            geography: decodeList(investorProfile.geographyJson),
            checkSizeMinUsd: investorProfile.checkSizeMinUsd,
            checkSizeMaxUsd: investorProfile.checkSizeMaxUsd,
          },
          listing: {
            sectorTier1: listing.sectorTier1,
            stage: listing.stage,
            askAmountUsd: listing.askAmountUsd,
            geography: listing.geography,
          },
        })
      : undefined,
  }));

  if (investorProfile) {
    withMatch.sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));
  }

  const activeFilterCount = ["sector", "stage", "geography", "q"].filter((k) => params[k]).length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[var(--color-navy)]">Browse listings</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {listings.length} published listing{listings.length === 1 ? "" : "s"}
            {investorProfile && " · sorted by your match score"}
          </p>
        </div>
      </div>

      <form method="get" className="mt-6 grid gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-4 sm:grid-cols-5">
        <input
          type="search"
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search company or keyword"
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-navy)] sm:col-span-2"
        />
        <select name="sector" defaultValue={params.sector ?? ""} className="rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm">
          <option value="">All sectors</option>
          {SECTOR_TIER1.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select name="stage" defaultValue={params.stage ?? ""} className="rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm">
          <option value="">All stages</option>
          {STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select name="geography" defaultValue={params.geography ?? ""} className="rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm">
          <option value="">All geographies</option>
          {GEOGRAPHIES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <div className="flex gap-2 sm:col-span-5">
          <button type="submit" className="rounded-md bg-[var(--color-navy-fill)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-navy-soft)]">
            Apply filters
          </button>
          {activeFilterCount > 0 && (
            <Link href="/listings" className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]">
              Clear
            </Link>
          )}
        </div>
      </form>

      <div className="mt-8">
        {withMatch.length === 0 ? (
          <EmptyState
            title="No listings match these filters"
            description="Try clearing a filter, or check back later — founders publish new raises regularly."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {withMatch.map(({ listing, match }) => (
              <ListingCard key={listing.id} listing={listing} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
