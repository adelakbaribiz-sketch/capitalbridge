import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { decodeList } from "@/lib/json-list";
import { computeMatchScore } from "@/lib/match";
import { stageLabel, raiseTypeLabel } from "@/lib/taxonomy";
import { formatUsdCompact, StatusBadge } from "@/components/ui";
import { MatchBadge } from "@/components/match-badge";
import { ExpressInterestButton } from "@/components/express-interest-button";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { founder: { select: { id: true, name: true, email: true } } },
  });
  if (!listing) notFound();

  const isOwner = session?.userId === listing.founderId;
  const isAdmin = session?.role === "ADMIN";
  if (listing.status !== "PUBLISHED" && !isOwner && !isAdmin) notFound();

  // Real (not seeded) engagement signal: log this view, skipping the founder viewing their own listing.
  if (session && !isOwner) {
    await prisma.listingView.create({ data: { listingId: listing.id, viewerId: session.userId } });
  } else if (!session) {
    await prisma.listingView.create({ data: { listingId: listing.id, viewerId: null } });
  }

  let match = null;
  let existingInterest = null;
  const investorId = session?.role === "INVESTOR" ? session.userId : null;
  const [profileRow, interestRow, viewCount, interestCount] = await Promise.all([
    investorId ? prisma.investorProfile.findUnique({ where: { userId: investorId } }) : null,
    investorId
      ? prisma.interest.findUnique({ where: { listingId_investorId: { listingId: listing.id, investorId } } })
      : null,
    prisma.listingView.count({ where: { listingId: listing.id } }),
    prisma.interest.count({ where: { listingId: listing.id, status: "INTERESTED" } }),
  ]);
  existingInterest = interestRow;
  if (investorId) {
    const profile = profileRow;
    if (profile) {
      match = computeMatchScore({
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
      });
    }
  }

  const tier2 = decodeList(listing.sectorTier2Json);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {(isOwner || isAdmin) && listing.status !== "PUBLISHED" && (
        <div className="mb-6 rounded-md border border-[var(--color-amber)]/30 bg-[var(--color-amber-soft)] px-4 py-2 text-sm text-[var(--color-amber)]">
          This listing is {listing.status === "DRAFT" ? "a draft" : "archived"} and only visible to you.{" "}
          <StatusBadge status={listing.status} />
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[var(--color-navy)]">{listing.companyName}</h1>
          <p className="mt-1 text-[var(--color-ink-muted)]">{listing.tagline}</p>
        </div>
        {match && <MatchBadge score={match.score} band={match.band} />}
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-[var(--color-slate-soft)] px-2.5 py-1 text-xs text-[var(--color-ink-muted)]">
          {listing.sectorTier1}
        </span>
        {tier2.map((t) => (
          <span key={t} className="rounded-full bg-[var(--color-slate-soft)] px-2.5 py-1 text-xs text-[var(--color-ink-muted)]">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-8 grid gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5 sm:grid-cols-4">
        <div>
          <p className="text-xs text-[var(--color-ink-muted)]">Stage</p>
          <p className="mt-0.5 font-medium">{stageLabel(listing.stage)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-ink-muted)]">Raising</p>
          <p className="mt-0.5 font-medium">
            {formatUsdCompact(listing.askAmountUsd)} · {raiseTypeLabel(listing.raiseType)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-ink-muted)]">Geography</p>
          <p className="mt-0.5 font-medium">{listing.geography}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-ink-muted)]">Team size</p>
          <p className="mt-0.5 font-medium">{listing.teamSize ?? "—"}</p>
        </div>
      </div>

      {listing.tractionSummary && (
        <div className="mt-6 rounded-lg border border-[var(--color-emerald)]/20 bg-[var(--color-emerald-soft)] px-4 py-3 text-sm text-[var(--color-emerald)]">
          <span className="font-semibold">Traction: </span>
          {listing.tractionSummary}
        </div>
      )}

      <div className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-ink)]">
        {listing.description}
      </div>

      {listing.websiteUrl && (
        <p className="mt-6 text-sm">
          <a href={listing.websiteUrl} className="font-medium text-[var(--color-navy)] underline underline-offset-2" target="_blank" rel="noreferrer">
            Visit company website ↗
          </a>
        </p>
      )}

      {match && (
        <div className="mt-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-[var(--color-navy)]">Why this score?</h2>
            <span className="text-xs text-[var(--color-ink-muted)]">Rule-based, not AI — see Limitations</span>
          </div>
          <ul className="mt-4 space-y-3">
            {match.factors.map((f) => (
              <li key={f.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{f.label}</span>
                  <span className="tabular-nums text-[var(--color-ink-muted)]">
                    {f.points}/{f.maxPoints}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-slate-soft)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-navy-fill)]"
                    style={{ width: `${(f.points / f.maxPoints) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{f.detail}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <ExpressInterestButton listingId={listing.id} alreadyInterested={existingInterest?.status === "INTERESTED"} />
          </div>
        </div>
      )}

      {session?.role === "INVESTOR" && !match && (
        <div className="mt-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5 text-sm text-[var(--color-ink-muted)]">
          Set up your{" "}
          <Link href="/settings/profile" className="font-medium text-[var(--color-navy)] underline underline-offset-2">
            investor profile
          </Link>{" "}
          to see your match score and express interest.
        </div>
      )}

      {(isOwner || isAdmin) && (
        <div className="mt-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5 text-sm">
          <p className="font-medium text-[var(--color-ink)]">Engagement (real, not seeded)</p>
          <p className="mt-1 text-[var(--color-ink-muted)]">
            {viewCount} view{viewCount === 1 ? "" : "s"} · {interestCount} expressed interest
          </p>
        </div>
      )}
    </div>
  );
}
