const REAL = [
  "Founder/investor auth (bcrypt + JWT session cookie)",
  "Listing create/edit/publish/archive, persisted in SQLite via Prisma",
  "Investor profile (thesis, sectors, stages, check size, geography)",
  "Rule-based compatibility scoring (not AI/ML) with a visible factor breakdown",
  "Browse filters, search, and the 3-way comparison table",
  "Listing view counts and expressed-interest counts (logged live, not seeded)",
  "Minimal admin moderation (publish/unpublish/archive, user list)",
];

const SIMULATED = [
  "Seed accounts, seed listings, and their traction/company details (fictional)",
  "The \"Verified\" investor flag (a boolean, not a real accreditation/KYC check)",
];

const NOT_IMPLEMENTED = [
  "KYC/AML/accreditation verification",
  "E-signature and document vault (deal room)",
  "Escrow, payments, or any movement of real funds",
  "Auction / bidding clearing engine (static concept screen only)",
  "LLM-based contract drafting (static concept screen only)",
  "Web scraping / market intelligence pipeline",
  "Real-time messaging",
  "AI/ML matching model (current scorer is deterministic, rule-based code)",
  "Native mobile app",
];

function List({ items, tone }: { items: string[]; tone: "emerald" | "amber" | "rose" }) {
  const dot = { emerald: "bg-[var(--color-emerald)]", amber: "bg-[var(--color-amber)]", rose: "bg-[var(--color-rose)]" }[tone];
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span className="text-[var(--color-ink)]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function LimitationsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">What&apos;s real vs. simulated</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        CapitalBridge is a portfolio demo of a founder/investor marketplace concept, not a real
        fundraising platform. No real company, investor, capital raise, or regulatory license
        exists here. This page mirrors docs/LIMITATIONS.md.
      </p>

      <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5">
        <p className="font-display text-lg text-[var(--color-emerald)]">Real</p>
        <List items={REAL} tone="emerald" />
      </div>

      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5">
        <p className="font-display text-lg text-[var(--color-amber)]">Simulated / demo data</p>
        <List items={SIMULATED} tone="amber" />
      </div>

      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5">
        <p className="font-display text-lg text-[var(--color-rose)]">Not implemented</p>
        <List items={NOT_IMPLEMENTED} tone="rose" />
      </div>
    </div>
  );
}
