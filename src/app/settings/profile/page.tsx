import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { decodeList } from "@/lib/json-list";
import { InvestorProfileForm } from "@/components/investor-profile-form";

export default async function ProfileSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "INVESTOR") redirect("/");

  const { welcome } = await searchParams;
  const profile = await prisma.investorProfile.findUniqueOrThrow({ where: { userId: session.userId } });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Investor profile</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Drives your match scores and the sort order of the browse feed. Nothing here is verified —
        see docs/LIMITATIONS.md.
      </p>

      <InvestorProfileForm
        welcome={welcome === "1"}
        initial={{
          thesis: profile.thesis,
          sectors: decodeList(profile.sectorsJson),
          stages: decodeList(profile.stagesJson),
          geography: decodeList(profile.geographyJson),
          checkSizeMinUsd: profile.checkSizeMinUsd,
          checkSizeMaxUsd: profile.checkSizeMaxUsd,
        }}
      />
    </div>
  );
}
