import { prisma } from "@/lib/prisma";
import { stageLabel, raiseTypeLabel } from "@/lib/taxonomy";
import { formatUsdCompact } from "@/components/ui";
import { decodeList } from "@/lib/json-list";
import { SelectField } from "@/components/design-system/field";
import { Button } from "@/components/design-system/button";
import { Surface } from "@/components/design-system/surface";

const SLOTS = 3;

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const allListings = await prisma.listing.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { companyName: "asc" },
  });

  const selectedIds = Array.from({ length: SLOTS }, (_, i) => params[`slot${i}`]).filter(
    (v): v is string => Boolean(v),
  );
  const selected = await prisma.listing.findMany({ where: { id: { in: selectedIds } } });
  const orderedSelected = selectedIds.map((id) => selected.find((l) => l.id === id)).filter(Boolean) as typeof selected;

  const rows: { label: string; render: (l: (typeof allListings)[number]) => string }[] = [
    { label: "Sector", render: (l) => l.sectorTier1 },
    { label: "Sub-sectors", render: (l) => decodeList(l.sectorTier2Json).join(", ") || "—" },
    { label: "Stage", render: (l) => stageLabel(l.stage) },
    { label: "Instrument", render: (l) => raiseTypeLabel(l.raiseType) },
    { label: "Raising", render: (l) => `${formatUsdCompact(l.askAmountUsd)} ${l.currency}` },
    { label: "Geography", render: (l) => l.geography },
    { label: "Team size", render: (l) => (l.teamSize ? String(l.teamSize) : "—") },
    { label: "Traction", render: (l) => l.tractionSummary ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Compare listings</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Pick up to {SLOTS} published listings to compare side by side. The URL is shareable.
      </p>

      <form method="get" className="mt-6 grid gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-4 sm:grid-cols-3">
        {Array.from({ length: SLOTS }, (_, i) => (
          <SelectField key={i} name={`slot${i}`} defaultValue={params[`slot${i}`] ?? ""}>
            <option value="">Slot {i + 1}: choose a listing</option>
            {allListings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.companyName}
              </option>
            ))}
          </SelectField>
        ))}
        <Button type="submit" className="sm:col-span-3 sm:w-fit">
          Compare
        </Button>
      </form>

      {orderedSelected.length > 0 ? (
        <Surface className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="p-3 text-left font-medium text-[var(--color-ink-muted)]">Field</th>
                {orderedSelected.map((l) => (
                  <th key={l.id} className="p-3 text-left font-display text-base text-[var(--color-navy)]">
                    {l.companyName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="p-3 font-medium text-[var(--color-ink-muted)]">{row.label}</td>
                  {orderedSelected.map((l) => (
                    <td key={l.id} className="p-3">
                      {row.render(l)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      ) : (
        <p className="mt-10 text-sm text-[var(--color-ink-muted)]">Choose at least one listing above to compare.</p>
      )}
    </div>
  );
}
