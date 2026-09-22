import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/listing-card";
import { DemoBadge } from "@/components/ui";

export default async function HomePage() {
  const featured = await prisma.listing.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/70">
            Portfolio demo — not a real fundraising platform
          </span>
          <h1 className="font-display mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
            One listing. Every investor who should see it.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            CapitalBridge is a founder ⇄ investor marketplace: publish a raise once, get matched
            against investor theses with a transparent, explainable score — not a black box.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-white/90"
            >
              Create an account
            </Link>
            <Link
              href="/listings"
              className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/60"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-[var(--color-navy)]">01</p>
            <h2 className="mt-2 font-medium text-[var(--color-ink)]">Publish once</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Founders create one structured listing — sector, stage, ask, traction — instead of a
              different deck format for every investor.
            </p>
          </div>
          <div>
            <p className="font-display text-2xl text-[var(--color-navy)]">02</p>
            <h2 className="mt-2 font-medium text-[var(--color-ink)]">See the real score</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Every match shows the exact factors behind the number — sector, stage, check size,
              geography — not a mysterious &quot;AI recommendation.&quot;
            </p>
          </div>
          <div>
            <p className="font-display text-2xl text-[var(--color-navy)]">03</p>
            <h2 className="mt-2 font-medium text-[var(--color-ink)]">Compare, then act</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Investors shortlist and compare listings side by side before expressing interest.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--color-border)] bg-[var(--color-paper-raised)]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-[var(--color-navy)]">Live on the platform</h2>
            <DemoBadge label="Seed data" />
          </div>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            These listings were created by the seed script for demo purposes, not real companies.
          </p>

          {featured.length === 0 ? (
            <p className="mt-8 text-sm text-[var(--color-ink-muted)]">
              No published listings yet. Run <code>npm run db:seed</code> or create one from a
              founder account.
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <Link href="/listings" className="text-sm font-medium text-[var(--color-navy)] underline underline-offset-2">
              View all listings →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
