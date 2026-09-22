"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { encodeList } from "@/lib/json-list";
import { SECTOR_TIER1, STAGES, GEOGRAPHIES } from "@/lib/taxonomy";
import type { ActionState } from "@/lib/actions/auth";

const profileSchema = z
  .object({
    thesis: z.string().trim().min(10, "Say a bit more about what you invest in").max(1000),
    sectors: z.array(z.enum(SECTOR_TIER1)).min(1, "Pick at least one sector"),
    stages: z.array(z.enum(STAGES.map((s) => s.value) as [string, ...string[]])).min(1, "Pick at least one stage"),
    geography: z.array(z.enum(GEOGRAPHIES)).min(1, "Pick at least one geography"),
    checkSizeMinUsd: z.coerce.number().int().min(0),
    checkSizeMaxUsd: z.coerce.number().int().min(0),
  })
  .refine((d) => d.checkSizeMaxUsd >= d.checkSizeMinUsd, {
    message: "Max check size must be at least the min check size",
    path: ["checkSizeMaxUsd"],
  });

export async function updateInvestorProfileAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "INVESTOR") {
    return { error: "You must be signed in as an investor." };
  }

  const parsed = profileSchema.safeParse({
    thesis: formData.get("thesis"),
    sectors: formData.getAll("sectors").map(String),
    stages: formData.getAll("stages").map(String),
    geography: formData.getAll("geography").map(String),
    checkSizeMinUsd: formData.get("checkSizeMinUsd"),
    checkSizeMaxUsd: formData.get("checkSizeMaxUsd"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const data = parsed.data;
  await prisma.investorProfile.update({
    where: { userId: session.userId },
    data: {
      thesis: data.thesis,
      sectorsJson: encodeList(data.sectors),
      stagesJson: encodeList(data.stages),
      geographyJson: encodeList(data.geography),
      checkSizeMinUsd: data.checkSizeMinUsd,
      checkSizeMaxUsd: data.checkSizeMaxUsd,
    },
  });

  revalidatePath("/settings/profile");
  revalidatePath("/dashboard/investor");
  return undefined;
}
