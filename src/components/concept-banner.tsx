export function ConceptBanner() {
  return (
    <div className="rounded-md border border-[var(--color-amber)]/30 bg-[var(--color-amber-soft)] px-4 py-3 text-sm text-[var(--color-amber)]">
      <span className="font-semibold">Concept preview — not implemented.</span> This screen shows
      the intended product experience. There is no working backend behind it: no real bidding,
      clearing, or document generation happens here. See{" "}
      <a href="/docs-limitations" className="underline underline-offset-2">
        Limitations
      </a>
      .
    </div>
  );
}
