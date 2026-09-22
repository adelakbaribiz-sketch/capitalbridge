# Product Requirements

## Problem

Founders raising capital publish the same information (deck, traction, ask) differently to every
investor they reach, with no way to know upfront who is actually a fit. Investors sourcing deal
flow get pitched broadly, with no transparent signal for why a given company matches their thesis.
(Full competitive/market framing: source dossier §2–3.)

## Users (implemented)

| Role | Can do in this build |
|---|---|
| **Founder** | Sign up, create/edit/publish/archive listings, see real view + interest counts and a views-over-time chart for their own listings. |
| **Investor** | Sign up, set an investment thesis (sectors/stages/check size/geography), browse and filter listings, see an explainable match score per listing, express interest, compare up to 3 listings side by side. |
| **Admin** | View all users and listings, publish/unpublish/archive any listing. |

Personas from the dossier not implemented (Compliance Officer, Legal Counsel, Service Provider) —
see [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) gap table.

## Functional requirements delivered

1. A founder can create a listing with sector (Tier-1 + up to 6 Tier-2 tags), stage, raise
   instrument, ask amount, geography, team size, and a free-text traction summary; save as draft
   or publish.
2. An investor can set a thesis and see, for every published listing, a 0–100 compatibility score
   with a visible per-factor breakdown (sector/stage/check-size/geography) — not a black box.
3. The browse page supports filtering by sector, stage, and geography, plus free-text search, and
   sorts by match score when the visitor is a signed-in investor with a profile.
4. An investor can express interest in a listing; this is recorded with the score at time of
   action and is visible to the founder as an aggregate count (not investor-identifying, by
   design — no messaging exists yet to safely disclose that).
5. Up to 3 published listings can be compared side by side via a shareable URL.
6. An admin can publish, unpublish, or archive any listing and see a user/listing overview.
7. Every listing-detail page view is logged and rolled up into real (not fabricated) engagement
   counts and a per-day chart on the founder dashboard.

## Non-functional requirements

- **Responsive**: usable down to a 375px-wide viewport (forms stack, tables scroll horizontally).
- **Explainability over opacity**: the match score always shows its factor breakdown; there is no
  score presented without the reasoning behind it.
- **Honesty over polish**: any feature not actually working is either absent or clearly labeled a
  concept preview — see [LIMITATIONS.md](LIMITATIONS.md).

## Explicitly out of scope for this MVP

KYC/AML/accreditation verification, payments/escrow, e-signature, a real auction clearing engine,
LLM-based contract drafting, web scraping, real-time messaging, and a native mobile app. Each has
a reason documented in [DECISIONS.md](DECISIONS.md) and a path forward in
[ROADMAP.md](ROADMAP.md) — none are silently dropped.
