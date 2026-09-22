import { ConceptBanner } from "@/components/concept-banner";

const TEMPLATES = ["Term Sheet", "SAFE", "Convertible Note", "Equity Purchase Agreement", "Side Letter", "NDA"];

export default function ContractsConceptPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <ConceptBanner />

      <h1 className="font-display mt-6 text-3xl text-[var(--color-navy)]">Contract drafting (concept)</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        From the source dossier: LLM-assisted drafting of Term Sheets, SAFEs, and other deal
        documents, with redline negotiation and e-signature. This is a legal-document generator —
        shipping a fake &quot;signed contract&quot; output would misrepresent a real legal
        artifact, so this MVP shows only the intended UI. See docs/DECISIONS.md (D4).
      </p>

      <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5">
        <p className="text-sm font-medium text-[var(--color-ink)]">1. Choose a template</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TEMPLATES.map((t, i) => (
            <span
              key={t}
              className={`rounded-full border px-3 py-1 text-xs ${
                i === 1
                  ? "border-[var(--color-navy)] bg-[var(--color-navy)] text-white"
                  : "border-[var(--color-border)] text-[var(--color-ink-muted)]"
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        <p className="mt-6 text-sm font-medium text-[var(--color-ink)]">2. Draft preview (illustrative only)</p>
        <div className="mt-2 rounded-md border border-[var(--color-border)] bg-[var(--color-paper)] p-4 font-mono text-xs leading-relaxed text-[var(--color-ink-muted)]">
          SIMPLE AGREEMENT FOR FUTURE EQUITY
          <br />
          <br />
          Company: [Arclight Robotics, Inc.]
          <br />
          Investor: [ ]
          <br />
          Purchase Amount: $[ ]
          <br />
          Valuation Cap: $[ ]
          <br />
          <br />
          <span className="italic">— placeholder text, no document is actually generated —</span>
        </div>

        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-md bg-[var(--color-slate-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-muted)]"
        >
          Generate &amp; send for signature (disabled — concept only)
        </button>
      </div>
    </div>
  );
}
