import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { decodeList } from "@/lib/json-list";
import { computeMatchScore } from "@/lib/match";
import { ListingCard } from "@/components/listing-card";
import { EmptyState, StatTile } from "@/components/ui";

export default async function InvestorDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "INVESTOR") redirect("/");

  const profile = await prisma.investorProfile.findUnique({ where: { userId: session.userId } });
  const profileIncomplete = !profile || decodeList(profile.sectorsJson).length === 0;

  const [listings, interests] = await Promise.all([
    prisma.listing.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "desc" } }),
    prisma.interest.findMany({
      where: { investorId: session.userId, status: "INTERESTED" },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const withMatch = profile
    ? listings
        .map((listing) => ({
          listing,
          match: computeMatchScore({
            investor: {
              sectors: decodeList(profile.sectorsJson),
              stages: decodeList(profile.stagesJson),
              geography: decodeList(profile.geographyJson),
              checkSizeMinUsd: profile.checkSizeMinUsd,
              checkSizeMaxUsd: profile.checkSizeMaxUsd,
            },
            listing: {
              sectorTier1: listing.sectorTier1,
              stage: listing.stage,
              askAmountUsd: listing.askAmountUsd,
              geography: listing.geography,
            },
          }),
        }))
        .sort((a, b) => b.match.score - a.match.score)
        .slice(0, 6)
    : [];

  const strongCount = withMatch.filter((m) => m.match.band === "Strong").length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Investor dashboard</h1>

      {profileIncomplete && (
        <div className="mt-4 rounded-md border border-[var(--color-amber)]/30 bg-[var(--color-amber-soft)] px-4 py-3 text-sm text-[var(--color-amber)]">
          Your investor profile is incomplete, so match scores can&apos;t be computed yet.{" "}
          <Link href="/settings/profile" className="font-semibold underline underline-offset-2">
            Finish your profile
          </Link>
        </div>
      )}

      {!profileIncomplete && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatTile label="Strong matches" value={String(strongCount)} hint="Score ≥ 80" />
          <StatTile label="Published listings" value={String(listings.length)} />
          <StatTile label="You've expressed interest in" value={String(interests.length)} />
        </div>
      )}

      {!profileIncomplete && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-[var(--color-navy)]">Your top matches</h2>
            <Link href="/listings" className="text-sm font-medium text-[var(--color-navy)] underline underline-offset-2">
              Browse all →
            </Link>
          </div>
          {withMatch.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="No published listings yet" description="Check back soon — founders publish new raises regularly." />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {withMatch.map(({ listing, match }) => (
                <ListingCard key={listing.id} listing={listing} match={match} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-xl text-[var(--color-navy)]">Listings you&apos;re interested in</h2>
        {interests.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Nothing here yet" description="Express interest on a listing to track it here." />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)]">
            {interests.map((i) => (
              <Link key={i.id} href={`/listings/${i.listingId}`} className="flex items-center justify-between p-4 hover:bg-[var(--color-slate-soft)]">
                <span className="font-medium text-[var(--color-navy)]">{i.listing.companyName}</span>
                <span className="text-sm text-[var(--color-ink-muted)]">Score {i.score} at time of interest</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
