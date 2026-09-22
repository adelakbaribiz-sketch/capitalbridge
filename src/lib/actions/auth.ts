"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSessionCookie, clearSessionCookie } from "@/lib/auth";
import { encodeList } from "@/lib/json-list";

export type ActionState = { error?: string } | undefined;

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["FOUNDER", "INVESTOR"]),
});

export async function signupAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      ...(role === "INVESTOR"
        ? {
            investorProfile: {
              create: {
                thesis: "New investor — thesis not yet set.",
                sectorsJson: encodeList([]),
                stagesJson: encodeList([]),
                geographyJson: encodeList([]),
                checkSizeMinUsd: 0,
                checkSizeMaxUsd: 0,
              },
            },
          }
        : {}),
    },
  });

  await createSessionCookie({ userId: user.id, role: user.role, name: user.name });

  redirect(role === "FOUNDER" ? "/dashboard/founder" : "/settings/profile?welcome=1");
}

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Incorrect email or password." };
  }

  await createSessionCookie({ userId: user.id, role: user.role, name: user.name });

  redirect(
    user.role === "FOUNDER" ? "/dashboard/founder" : user.role === "ADMIN" ? "/admin" : "/dashboard/investor",
  );
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}
