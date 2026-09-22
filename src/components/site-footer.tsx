import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-paper-raised)]">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-[var(--color-ink-muted)]">
        <p className="max-w-2xl">
          CapitalBridge is a portfolio demo, not a real fundraising platform. No real company,
          investor, capital raise, or regulatory license exists here. See{" "}
          <Link href="/docs-limitations" className="underline underline-offset-2">
            what&apos;s real vs. simulated
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/concepts/auction" className="hover:text-[var(--color-ink)]">
            Concept: Auctions
          </Link>
          <Link href="/concepts/contracts" className="hover:text-[var(--color-ink)]">
            Concept: Contract drafting
          </Link>
          <Link href="/docs-limitations" className="hover:text-[var(--color-ink)]">
            Limitations
          </Link>
        </div>
      </div>
    </footer>
  );
}
