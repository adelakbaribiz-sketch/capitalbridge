# Architecture

## Overview

One Next.js 16 (App Router) application. Server Components read data directly via Prisma; all
writes go through `"use server"` Server Actions in [src/lib/actions](../src/lib/actions). There is
no separate backend service and no REST/GraphQL API surface — see [API_SPEC.md](API_SPEC.md) for
why, and [DECISIONS.md](DECISIONS.md) (D1) for the reasoning versus the dossier's microservices
proposal.

```
Browser
  │
  ▼
Next.js App Router (single Node process)
  ├─ Server Components  ──► Prisma Client ──► SQLite (dev.db)
  └─ Server Actions      ──► Prisma Client ──► SQLite (dev.db)
         │
         └─► src/lib/match.ts (deterministic scoring, no external calls)
         └─► src/lib/auth.ts + password.ts (JWT cookie session, bcrypt)
```

## Directory layout

```
capitalbridge/
├── prisma/
│   ├── schema.prisma      # data model (see DATA_MODEL.md)
│   └── seed.ts            # demo/seed data (see DEMO.md)
├── src/
│   ├── app/                # routes (App Router) — one folder per URL segment
│   │   ├── listings/, dashboard/, compare/, admin/, concepts/, settings/...
│   ├── components/         # shared UI (server + a few "use client" leaf components)
│   └── lib/
│       ├── actions/         # "use server" mutations (auth, listings, profile)
│       ├── auth.ts          # session cookie sign/verify
│       ├── password.ts      # bcrypt wrapper
│       ├── match.ts          # rule-based compatibility scorer
│       ├── json-list.ts      # SQLite array-as-JSON helpers
│       ├── taxonomy.ts        # sector/stage/geography reference data
│       └── prisma.ts          # Prisma client singleton
└── docs/                    # this documentation set
```

## Request flow examples

**Browsing listings with a match score** (`/listings`): a Server Component reads `searchParams`,
queries `prisma.listing.findMany` with the filters applied at the SQL level, then — if the visitor
is a signed-in investor — calls `computeMatchScore()` per listing in-process (no network call) and
sorts by score before rendering.

**Creating a listing**: the client form in `/listings/new` posts to `createListingAction`
(a Server Action), which validates with Zod, checks the session role server-side, writes via
Prisma, and redirects — all in one round trip, no separate API route to keep in sync.

## Why not the dossier's proposed architecture

See [DECISIONS.md](DECISIONS.md) for the full reasoning (D1–D6). In short: the dossier's
microservices/polyglot-persistence/message-queue design is sized for a platform at real scale;
this repository is a single-team MVP with seed data, and the dossier's own text recommends
starting with a modular monolith. Every piece of that design remains a documented, intentional
Phase 2+ path in [ROADMAP.md](ROADMAP.md), not a silently dropped requirement.

## Path to Postgres / multi-instance deployment

1. Set `datasource db { provider = "postgresql" }` in `schema.prisma` and point `DATABASE_URL` at
   a real Postgres instance.
2. Normalize the JSON-encoded list columns into join tables (see DATA_MODEL.md's "known
   simplifications") if you need indexed sector/stage filtering at scale.
3. Move session storage off a single-process JWT-only model if you need server-side revocation.
4. Everything else (routes, Server Actions, components) is unaffected — Prisma is the only layer
   that talks to the database.
