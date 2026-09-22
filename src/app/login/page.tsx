"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { FormError } from "@/components/ui";

const DEMO_ACCOUNTS = [
  { role: "Founder", email: "dana@arclight.demo" },
  { role: "Investor", email: "sofia@northbridgevc.demo" },
  { role: "Admin", email: "admin@capitalbridge.demo" },
];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-6 py-16 sm:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl text-[var(--color-navy)]">Sign in</h1>
        <form action={formAction} className="mt-6 space-y-4">
          <FormError message={state?.error} />
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[var(--color-ink)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-navy)]"
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
              className="mt-1 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-navy)]"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-[var(--color-navy)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-soft)] disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
          No account?{" "}
          <Link href="/signup" className="font-medium text-[var(--color-navy)] underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Demo credentials
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Every seed account uses the password <code className="rounded bg-[var(--color-slate-soft)] px-1">demo1234</code>.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {DEMO_ACCOUNTS.map((acc) => (
            <li key={acc.email} className="flex items-center justify-between gap-3 rounded-md bg-[var(--color-slate-soft)] px-3 py-2">
              <span className="font-medium text-[var(--color-ink)]">{acc.role}</span>
              <code className="text-xs text-[var(--color-ink-muted)]">{acc.email}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
