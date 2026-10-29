"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction } from "@/lib/actions/auth";
import { FormError } from "@/components/ui";

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
              className={`cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-medium transition ${
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

        <div>
          <label htmlFor="name" className="text-sm font-medium text-[var(--color-ink)]">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-navy)]"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-navy)]"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-[var(--color-ink)]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none focus:border-[var(--color-navy)]"
          />
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">At least 8 characters.</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-[var(--color-navy-fill)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-soft)] disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
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
