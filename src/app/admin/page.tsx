import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { StatTile, StatusBadge, formatUsdCompact } from "@/components/ui";
import { ListingStatusControls } from "@/components/listing-status-controls";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const [users, listings] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: { founder: { select: { name: true, email: true } } },
    }),
  ]);

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Admin</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Minimal moderation tools only — no dispute resolution workflow, no financial reporting.
        See docs/PROJECT_CONTEXT.md.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatTile label="Founders" value={String(roleCounts.FOUNDER ?? 0)} />
        <StatTile label="Investors" value={String(roleCounts.INVESTOR ?? 0)} />
        <StatTile label="Listings" value={String(listings.length)} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-[var(--color-navy)]">Listings</h2>
        <div className="mt-4 divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)]">
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--color-navy)]">{listing.companyName}</span>
                  <StatusBadge status={listing.status} />
                </div>
                <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">
                  {listing.founder.name} · {formatUsdCompact(listing.askAmountUsd)}
                </p>
              </div>
              <ListingStatusControls listingId={listing.id} status={listing.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-[var(--color-navy)]">Users</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-ink-muted)]">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Role</th>
                <th className="p-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-[var(--color-ink-muted)]">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 text-[var(--color-ink-muted)]">{u.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
