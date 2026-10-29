"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { encodeList, decodeList } from "@/lib/json-list";
import { computeMatchScore } from "@/lib/match";
import { SECTOR_TIER1, STAGES, RAISE_TYPES, GEOGRAPHIES } from "@/lib/taxonomy";
import type { ActionState } from "@/lib/actions/auth";

const listingSchema = z.object({
  companyName: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(5).max(160),
  description: z.string().trim().min(20).max(4000),
  sectorTier1: z.enum(SECTOR_TIER1),
  sectorTier2: z.array(z.string()).max(6).default([]),
  stage: z.enum(STAGES.map((s) => s.value) as [string, ...string[]]),
  raiseType: z.enum(RAISE_TYPES.map((r) => r.value) as [string, ...string[]]),
  askAmountUsd: z.coerce.number().int().min(10_000).max(500_000_000),
  geography: z.enum(GEOGRAPHIES),
  teamSize: z.coerce.number().int().min(1).max(100_000).optional(),
  tractionSummary: z.string().trim().max(500).optional(),
  websiteUrl: z.string().trim().url().optional().or(z.literal("")),
});

export async function createListingAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "FOUNDER") {
    return { error: "You must be signed in as a founder to create a listing." };
  }

  const publish = formData.get("intent") === "publish";
  const sectorTier2 = formData.getAll("sectorTier2").map(String);

  const parsed = listingSchema.safeParse({
    companyName: formData.get("companyName"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    sectorTier1: formData.get("sectorTier1"),
    sectorTier2,
    stage: formData.get("stage"),
    raiseType: formData.get("raiseType"),
    askAmountUsd: formData.get("askAmountUsd"),
    geography: formData.get("geography"),
    teamSize: formData.get("teamSize") || undefined,
    tractionSummary: formData.get("tractionSummary") || undefined,
    websiteUrl: formData.get("websiteUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const data = parsed.data;
  const listing = await prisma.listing.create({
    data: {
      founderId: session.userId,
      companyName: data.companyName,
      tagline: data.tagline,
      description: data.description,
      sectorTier1: data.sectorTier1,
      sectorTier2Json: encodeList(data.sectorTier2),
      stage: data.stage as never,
      raiseType: data.raiseType as never,
      askAmountUsd: data.askAmountUsd,
      geography: data.geography,
      teamSize: data.teamSize,
      tractionSummary: data.tractionSummary || null,
      websiteUrl: data.websiteUrl || null,
      status: publish ? "PUBLISHED" : "DRAFT",
    },
  });

  revalidatePath("/dashboard/founder");
  revalidatePath("/listings");
  redirect(`/listings/${listing.id}`);
}

export async function setListingStatusAction(listingId: string, status: "PUBLISHED" | "DRAFT" | "ARCHIVED") {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHENTICATED");

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error("NOT_FOUND");
  if (session.role !== "ADMIN" && listing.founderId !== session.userId) {
    throw new Error("FORBIDDEN");
  }

  await prisma.listing.update({ where: { id: listingId }, data: { status } });
  revalidatePath("/dashboard/founder");
  revalidatePath("/admin");
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/listings");
}

export async function expressInterestAction(listingId: string) {
  const session = await getSession();
  if (!session || session.role !== "INVESTOR") {
    throw new Error("Only investor accounts can express interest.");
  }

  const [listing, profile] = await Promise.all([
    prisma.listing.findUnique({ where: { id: listingId } }),
    prisma.investorProfile.findUnique({ where: { userId: session.userId } }),
  ]);
  if (!listing || listing.status !== "PUBLISHED") throw new Error("NOT_FOUND");
  if (!profile) throw new Error("Set up your investor profile before expressing interest.");

  const { score } = computeMatchScore({
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

  await prisma.interest.upsert({
    where: { listingId_investorId: { listingId, investorId: session.userId } },
    update: { status: "INTERESTED", score },
    create: { listingId, investorId: session.userId, score, status: "INTERESTED" },
  });

  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/dashboard/investor");
}
