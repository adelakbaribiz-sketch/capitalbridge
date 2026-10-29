"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav({
  links,
  dashboardHref,
}: {
  links: { href: string; label: string }[];
  dashboardHref: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle navigation menu"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-ink)]"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 4h14M1 8h14M1 12h14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-[65px] z-20 border-b border-[var(--color-border)] bg-[var(--color-paper-raised)] px-6 py-4 text-sm shadow-sm">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block font-medium text-[var(--color-ink)]">
                  {link.label}
                </Link>
              </li>
            ))}
            {dashboardHref && (
              <li>
                <Link href={dashboardHref} onClick={() => setOpen(false)} className="block font-medium text-[var(--color-ink)]">
                  Dashboard
                </Link>
              </li>
            )}
            <li className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
              <span className="font-medium text-[var(--color-ink)]">Theme</span>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
