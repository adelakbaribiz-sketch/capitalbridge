"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth";
import { FormError } from "@/components/ui";
import { TextField } from "@/components/design-system/field";
import { Button } from "@/components/design-system/button";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, undefined);
  const [role, setRole] = useState<"FOUNDER" | "INVESTOR">("FOUNDER");

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Create an account</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        Demo signup — no email verification, this is not a real identity check.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <FormError message={state?.error} />

        <fieldset className="grid grid-cols-2 gap-2">
          {(["FOUNDER", "INVESTOR"] as const).map((r) => (
            <label
              key={r}
              className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors duration-[var(--motion-fast)] ${
                role === r
                  ? "border-[var(--color-navy-fill)] bg-[var(--color-navy-fill)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-ink)]"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="sr-only"
              />
              {r === "FOUNDER" ? "I'm raising" : "I'm investing"}
            </label>
          ))}
        </fieldset>

        <TextField label="Full name" id="name" name="name" required />
        <TextField label="Email" id="email" name="email" type="email" required />
        <TextField
          label="Password"
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          hint="At least 8 characters."
        />

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--color-navy)] underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}
