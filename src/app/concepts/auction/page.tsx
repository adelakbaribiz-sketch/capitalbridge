import { ConceptBanner } from "@/components/concept-banner";

const BIDS = [
  { bidder: "Northbridge VC", amount: "$400,000", price: "$8.20 / share", time: "2m ago" },
  { bidder: "Greenfield Capital", amount: "$250,000", price: "$8.00 / share", time: "6m ago" },
  { bidder: "Lagos Angels", amount: "$120,000", price: "$7.85 / share", time: "14m ago" },
];

export default function AuctionConceptPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <ConceptBanner />

      <h1 className="font-display mt-6 text-3xl text-[var(--color-navy)]">Auction &amp; bidding (concept)</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        From the source dossier: five auction models (buy-side, sealed-bid, English, Dutch, call
        auction) with a uniform-price clearing algorithm, anti-sniping extensions, and an
        immutable audit trail. None of that exists yet — building it for real means a clearing
        engine, regulatory review (Reg A/A+, Reg CF, Rule 506(b)/(c)), and a live order book, which
        is out of scope for this MVP pass. See docs/ROADMAP.md.
      </p>

      <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper-raised)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg text-[var(--color-navy)]">Arclight Robotics — Seed auction</p>
            <p className="text-sm text-[var(--color-ink-muted)]">Ascending (English) · illustrative data, not live</p>
          </div>
          <span className="rounded-full bg-[var(--color-emerald-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-emerald)]">
            Static mockup
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-[var(--color-ink-muted)]">Reserve price</p>
            <p className="mt-0.5 font-medium">$7.50 / share</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-ink-muted)]">Time remaining</p>
            <p className="mt-0.5 font-medium">1h 42m</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-ink-muted)]">Current clearing price</p>
            <p className="mt-0.5 font-medium">$8.20 / share</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-[var(--color-ink)]">Order book</p>
          <div className="mt-2 divide-y divide-[var(--color-border)] rounded-md border border-[var(--color-border)]">
            {BIDS.map((b) => (
              <div key={b.bidder} className="flex items-center justify-between p-3 text-sm">
                <span className="font-medium">{b.bidder}</span>
                <span className="text-[var(--color-ink-muted)]">{b.amount} at {b.price}</span>
                <span className="text-xs text-[var(--color-ink-muted)]">{b.time}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-md bg-[var(--color-slate-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink-muted)]"
        >
          Place bid (disabled — concept only)
        </button>
      </div>
    </div>
  );
}
