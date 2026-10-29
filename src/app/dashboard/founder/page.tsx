import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { StatTile, StatusBadge, EmptyState, formatUsdCompact } from "@/components/ui";
import { ListingStatusControls } from "@/components/listing-status-controls";
import { ViewsChart } from "@/components/views-chart";
import { stageLabel } from "@/lib/taxonomy";
import { ButtonLink } from "@/components/design-system/button";
import { ElevatedSurface, Surface } from "@/components/design-system/surface";

export default async function FounderDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "FOUNDER") redirect("/");

  const listings = await prisma.listing.findMany({
    where: { founderId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { views: true, interests: true } } },
  });

  const listingIds = listings.map((l) => l.id);
  const views = listingIds.length
    ? await prisma.listingView.findMany({
        where: { listingId: { in: listingIds } },
        select: { createdAt: true },
      })
    : [];

  const byDay = new Map<string, number>();
  for (const v of views) {
    const day = v.createdAt.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  const chartData = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), views: count }));

  const totalViews = views.length;
  const totalInterest = listings.reduce((sum, l) => sum + l._count.interests, 0);
  const published = listings.filter((l) => l.status === "PUBLISHED").length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[var(--color-navy)]">Founder dashboard</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Views and interest below are real counts from this database, not seeded numbers.
          </p>
        </div>
        <ButtonLink href="/listings/new">New listing</ButtonLink>
      </div>

      {/* Primary insight: KPIs + trend live together as one elevated panel. */}
      <ElevatedSurface className="mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatTile label="Published listings" value={String(published)} />
          <StatTile label="Total views" value={String(totalViews)} hint="Logged per listing-detail page load" />
          <StatTile label="Expressed interest" value={String(totalInterest)} />
        </div>
        {chartData.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-[var(--color-ink)]">Views by day</p>
            <div className="mt-2">
              <ViewsChart data={chartData} />
            </div>
          </div>
        )}
      </ElevatedSurface>

      {/* Secondary: the working list (actions per row). */}
      <div className="mt-8">
        <h2 className="font-display text-xl text-[var(--color-navy)]">Your listings</h2>
        {listings.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No listings yet"
              description="Publish your first raise to start appearing in investor searches and match feeds."
              action={<ButtonLink href="/listings/new">Create a listing</ButtonLink>}
            />
          </div>
        ) : (
          <Surface className="mt-4 divide-y divide-[var(--color-border)]">
            {listings.map((listing) => (
              <div key={listing.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/listings/${listing.id}`} className="font-medium text-[var(--color-navy)] hover:underline">
                      {listing.companyName}
                    </Link>
                    <StatusBadge status={listing.status} />
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">
                    {stageLabel(listing.stage)} · {formatUsdCompact(listing.askAmountUsd)} · {listing._count.views} views ·{" "}
                    {listing._count.interests} interested
                  </p>
                </div>
                <ListingStatusControls listingId={listing.id} status={listing.status} />
              </div>
            ))}
          </Surface>
        )}
      </div>
    </div>
  );
}
