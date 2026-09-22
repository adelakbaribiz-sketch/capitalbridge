# Data Model

Full schema: [prisma/schema.prisma](../prisma/schema.prisma). This document explains the
entities and the simplifications made versus the source dossier's data model sketch.

## Entities

### User
One row per person, with a single `role`: `FOUNDER`, `INVESTOR`, or `ADMIN`. The dossier's
persona list also includes Compliance Officer, Legal Counsel, and Service Provider — not modeled
here, since none of the workflows those roles support (KYC review, contract approval, DD support)
are implemented. See [ROADMAP.md](ROADMAP.md).

### InvestorProfile
One-to-one with `User` (only for investors). Holds the investor's thesis, target sectors/stages/
geography (JSON-encoded string arrays — see below), and check-size range. `verifiedDemo` is a
plain boolean, **not** a real accreditation/KYC result — see [LIMITATIONS.md](LIMITATIONS.md).

### Listing
One row per fundraise. `sectorTier2Json` holds up to 6 free-form sub-sector tags. `status` is
`DRAFT | PUBLISHED | ARCHIVED`; only `PUBLISHED` listings appear in browse/search/match feeds.
There is no `Document` entity — the dossier's pitch-deck/financial-model uploads are represented
only as an optional `websiteUrl` and a `tractionSummary` text field, because real file storage
(S3 + virus scanning + access control) wasn't built for this pass.

### Interest
An investor "expressing interest" in a listing — the simplified stand-in for the dossier's
mutual-match / deal-room-entry step. Stores the compatibility `score` at the time of the action,
not a live-recomputed value, so an investor can see how the recommendation looked when they acted
on it. Unique per `(listingId, investorId)`.

### ListingView
Every listing-detail page load is logged here (with a nullable `viewerId` for anonymous views).
This is genuine, queried-live engagement data — the founder dashboard's view counts and chart
are **not** seeded fixtures, they are computed from this table. See docs/PROJECT_CONTEXT.md's
"real vs. simulated" section.

## Known simplifications

- **JSON-encoded lists instead of array columns or join tables.** SQLite has no native array
  type. `sectorsJson`, `stagesJson`, `geographyJson`, `sectorTier2Json` are JSON strings,
  (de)serialized via [src/lib/json-list.ts](../src/lib/json-list.ts). A production build on
  Postgres would normalize these into join tables (`ListingSectorTag`, `InvestorSector`, etc.) for
  indexed filtering — tracked in ROADMAP.md.
- **No `Document` / file-storage entity.** Real uploads need a storage backend and access control
  that weren't in scope; see LIMITATIONS.md.
- **No `Message`, `DealRoom`, `Contract`, `Bid`, or `Auction` tables.** These map to features that
  are either not implemented or are static concept-preview screens (see PROJECT_CONTEXT.md's gap
  table) — there is no real data behind them to model yet.
- **Money is a single `Int` in USD cents-free whole dollars, one currency field, no FX.** Good
  enough to display and filter; not good enough for real multi-currency accounting.
