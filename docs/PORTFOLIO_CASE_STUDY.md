# Portfolio Case Study

**Status: MVP / Demo.** Not a funded company, not customer-validated, not deployed anywhere public.

## What I built

CapitalBridge is a founder ⇄ investor marketplace MVP: founders publish structured fundraising
listings, investors set a thesis and get a transparent, explainable compatibility score against
every listing, browse/filter/compare, and record interest. A minimal admin layer moderates
content. Built end to end — schema, auth, business logic, UI, docs, tests, CI — from a 40-page
architecture/business dossier that itself contained no code.

## Problem

The dossier this was built from observed that founder/investor discovery is fragmented: founders
reformat the same pitch for every investor; investors get pitched broadly with no legible signal
for fit. The dossier's answer was a large, multi-jurisdiction platform (AI matching, compliance,
auctions, contract drafting, escrow) — real engineering for a funded team over quarters, not a
solo MVP pass.

## Approach

Rather than stub every headline feature with fake success states, I did a gap analysis first (see
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)) and split the dossier's 20 features into three buckets:
build for real, show as a labeled concept preview, or leave documented as roadmap. The explicit
rule: nothing that touches money, identity verification, or legal documents gets faked — those
either work for real or don't exist in this build.

## Architecture

One Next.js 16 App Router app, Server Components for reads, Server Actions for writes, Prisma +
SQLite for persistence (Postgres-ready schema). No microservices, no message queue, no six-database
polyglot-persistence stack the dossier proposed — see [DECISIONS.md](DECISIONS.md) for why that
was the right call at this scale, and [ARCHITECTURE.md](ARCHITECTURE.md) for the full picture.

## Key features

- **Explainable matching**: every score shows the exact sector/stage/check-size/geography factors
  behind the number, deterministically computed — no black box, no unverified "AI" claim.
- **Real engagement data**: founder-dashboard view/interest counts come from a `ListingView` table
  populated by actual page visits during the demo, not a seeded fixture.
- **Comparison tool**: shareable-URL side-by-side comparison of up to 3 listings.
- **Honest UI**: concept-preview screens for auction and contract-drafting are clearly banner-
  labeled as non-functional, and a dedicated `/docs-limitations` page states real-vs-simulated
  status in the app itself, not just in docs.

## Technical / product decisions worth noting

See [DECISIONS.md](DECISIONS.md) for the full ADR log — the headline ones: SQLite over a
six-database stack, a deterministic scorer over a fake "AI" call, and concept screens over faked
legal/financial functionality.

## Challenges

- Turning a dossier explicitly marked "0% implemented, every feature PROPOSED" into something
  demoable without either (a) building a multi-quarter platform or (b) faking the parts that
  matter (compliance, payments, AI claims). The gap-analysis table in PROJECT_CONTEXT.md is the
  record of how each of the 20 source features was resolved.
- Modeling list-valued fields (sectors, geography) without a database that supports arrays —
  solved with a documented JSON-string convention rather than reaching for Postgres just for that.

## Current status

**MVP / Demo**, locally runnable, not deployed. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the phased path to the parts of the dossier not yet built.
