# Roadmap

Ordered by what would need to be true before the next layer of the dossier's vision becomes real
— not by calendar date, since no team/funding/timeline exists for this project.

## Phase 2 — production-grade foundation
- [ ] Swap SQLite → Postgres (`schema.prisma` provider change + normalize JSON list columns into
      join tables for indexed filtering — see DATA_MODEL.md)
- [ ] Real file storage for pitch decks / financial models (S3-compatible, virus scanning, signed
      URLs, access control scoped to matched investors only)
- [ ] Email verification, password reset, rate limiting, MFA on auth
- [ ] Replace the rule-based scorer with a real evaluated model *only if* it demonstrably
      outperforms it on a held-out labeled dataset — otherwise keep the transparent version
- [ ] Automated test coverage beyond the current unit tests (see TESTING.md)

## Phase 3 — real compliance & execution
- [ ] Real KYC/AML/accreditation verification via a vendor (e.g. Persona, Shufti) — replaces the
      `verifiedDemo` boolean with an audited verification record
- [ ] Deal room: real document sharing with access control, threaded Q&A
- [ ] E-signature integration (DocuSign/Dropbox Sign) for the contract-drafting concept
- [ ] Messaging between founder and investor (currently only "express interest" exists)
- [ ] Multi-jurisdiction disclosure requirements research and legal review (SEC/FCA/ECSPR) —
      this is a legal workstream, not just an engineering one

## Phase 4 — scale features from the dossier
- [ ] Real auction/bidding engine with a reviewed clearing algorithm and audit trail
- [ ] Payments/escrow (Stripe Connect or equivalent) — only after compliance is real
- [ ] Web scraping / market intelligence pipeline (Crunchbase, SEC EDGAR, etc.)
- [ ] Native mobile app
- [ ] Secondary market (explicitly Phase 4 in the source dossier too)

## Not on the roadmap unless the product direction changes
- Multi-currency FX conversion (currently just a display field)
- A full 400+-tag industry taxonomy (current 10-vertical/45-tag subset covers the same UI surface)
