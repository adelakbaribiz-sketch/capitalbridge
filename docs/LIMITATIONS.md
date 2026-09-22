# Limitations — authoritative status

This is the canonical "what's real" document; [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) has the
per-dossier-feature table, and the in-app [`/docs-limitations`](../src/app/docs-limitations/page.tsx)
page mirrors this for anyone using the running app.

## REAL

- Founder/investor/admin auth (bcrypt + JWT session cookie)
- Listing create/edit/publish/archive, persisted in SQLite via Prisma
- Investor profile (thesis, sectors, stages, check size, geography)
- Rule-based compatibility scoring with a visible, per-factor breakdown
- Browse filters, search, and the 3-listing comparison table
- Listing view counts and expressed-interest counts (logged live from real page visits, not
  seeded — see the founder dashboard's "Views by day" chart)
- Minimal admin moderation (publish/unpublish/archive, user list)
- Input validation (Zod) and server-side authorization checks on every mutation

## MOCKED / SIMULATED

- Seed accounts, seed listings, and their company/traction details — entirely fictional, labeled
  `DEMO DATA` wherever shown
- The `verifiedDemo` flag on investor profiles — a boolean the seed script sets, not the output of
  any real verification check

## PROPOSED (documented, not built)

- Postgres migration path, real file storage, email verification/MFA — see ROADMAP.md Phase 2
- Real KYC/AML/accreditation, deal room, e-signature, messaging — see ROADMAP.md Phase 3
- Real auction engine, payments/escrow, scraping pipeline, mobile app — see ROADMAP.md Phase 4

## NOT IMPLEMENTED (and shown as such in the UI, not silently absent)

- `/concepts/auction` — static UI mockup of the auction/bidding feature, clearly banner-labeled
- `/concepts/contracts` — static UI mockup of the contract-drafting feature, clearly banner-labeled
- Any AI/ML component — the "match engine" is deterministic TypeScript, not a trained model; this
  is disclosed on every score (tooltip + the "Why this score?" panel) and in DECISIONS.md D3

## Known rough edges (real bugs / gaps worth knowing about)

- No pagination on `/listings` — fine at seed-data scale (5 listings), would need it at real scale.
- No image/logo upload anywhere — every listing is text-only.
- Founder dashboard's "engagement" numbers include the founder's own visits if they view their own
  listing while impersonating another test account in the same browser session — not a security
  issue, just a demo-data quirk worth knowing about when reading the numbers.
- Currency field is stored/displayed per listing but every computation (match scoring, comparison)
  treats the number as USD — a non-USD listing's numbers are not converted for scoring purposes.
