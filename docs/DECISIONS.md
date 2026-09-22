# Decisions

Architecture Decision Record for choices made turning the dossier into a buildable MVP. Each
entry: the decision, why, and what was rejected.

## D1. Single Next.js app instead of separate frontend/backend services

**Decision**: Build one Next.js 15 (App Router) application with API route handlers, instead of
the dossier's proposed NestJS + Python FastAPI + RabbitMQ + six-database microservices stack.

**Why**: The dossier's own roadmap (Section 26 / "What is missing") lists the microservices
architecture as `PROPOSED`, and its own text recommends "start with modular monolith for MVP
validation, then extract microservices as scale demands." A portfolio MVP with a handful of
entities and no real traffic gets zero benefit from message queues, five polyglot databases, or
service-to-service auth — it only adds operational surface that can't be demoed meaningfully.
One deployable app also means one real `npm run build` / `npm test` that a reviewer can run.

**Rejected**: NestJS API + separate Python match-scoring service — reconsider only if a real ML
model (not the current rule-based scorer) is introduced.

## D2. SQLite via Prisma instead of Postgres + MongoDB + Redis + Elasticsearch + PGVector + ClickHouse

**Decision**: One relational schema in SQLite (via Prisma ORM), file-based, zero external infra.

**Why**: The dossier's six-database "polyglot persistence" strategy is sized for a platform at
scale, not a demo with seed data. SQLite/Prisma gives real ACID persistence, real migrations, and
a schema a reviewer can read in one file — `git clone && npm install && npm run dev` runs it with
no Docker, no cloud account, and no seed database to provision. Prisma's schema is
Postgres-compatible syntax, so swapping the datasource to Postgres later (see ROADMAP.md) is a
config change, not a rewrite.

**Rejected**: Postgres in Docker Compose — adds a real dependency for zero demo benefit at this
scale; documented as the Phase 2 path instead.

## D3. Deterministic rule-based match score instead of an AI/ML match engine

**Decision**: `computeMatchScore()` is plain TypeScript: weighted overlap across sector, stage,
check-size range, and geography, producing a 0–100 score and a plain-language "why this score"
breakdown.

**Why**: The dossier's AI Match Engine (OpenAI/BGE-M3 embeddings + LLM scoring) requires a paid
model API, real training/eval data, and a bias/validation review before it could honestly be
called an AI feature — none of which exist yet. Shipping a fake "AI-powered" label on a stubbed
API call would be exactly the kind of fabricated capability these instructions prohibit. A
transparent rule-based scorer is real, explainable, testable, and gives investors and founders
the same triage utility the dossier asked for, honestly labeled as "rule-based," not AI.

**Rejected**: Calling an LLM API to "simulate" AI matching — rejected because it would misrepresent
a real product capability as more validated than it is, and because it introduces a paid external
dependency for a portfolio demo.

## D4. Concept-preview screens for Auction and Contract Drafting instead of building them

**Decision**: `/concepts/auction` and `/concepts/contracts` are polished, static UI screens
showing the intended product experience, clearly labeled "Concept Preview — not implemented,"
with no working backend behind them.

**Why**: Both are named as differentiators in the dossier, so removing them entirely loses
product-thinking signal for a portfolio review. But a real auction engine (clearing-price
algorithm, anti-sniping, regulatory audit trail) and real contract generation (template engine +
e-signature + jurisdiction-specific legal review) are multi-week efforts each, and mocking their
*output* (e.g., a fake "signed contract") would misrepresent a legal/financial artifact as real.
A labeled concept screen shows the UX intent without fabricating functionality or output.

**Rejected**: Fully functional auction/contract modules — out of scope for this pass, tracked in
ROADMAP.md.

## D5. No payments, escrow, KYC/AML, or e-signature integrations

**Decision**: These are not implemented, not stubbed with fake "success" responses, and not
represented as working anywhere in the UI beyond a labeled concept screen.

**Why**: These are regulated-industry integrations with real legal and financial consequences.
Faking them (e.g., a checkout button that "succeeds" without a real payment processor, or a
"Verified" badge with no real accreditation check behind it) would be actively misleading in a
financial product, not just an incomplete feature. The dossier's own compliance section lists
these as requiring real vendor integration (Stripe Connect, DocuSign, Shufti/zkMe) — that
integration work is real engineering effort for a future phase, not something to simulate.

**Rejected**: Mocked payment/KYC flows with fake success states — rejected on the same grounds as
the safety rule against fabricating financial transactions or credentials.

## D6. Demo auth (email + password, JWT cookie) instead of Keycloak/OAuth/SSO

**Decision**: A minimal real auth flow — bcrypt-hashed passwords, an httpOnly JWT session cookie,
role stored on the user record (`FOUNDER`, `INVESTOR`, `ADMIN`).

**Why**: Real enough to gate routes and demonstrate role-based access control, without standing
up an identity provider for a demo with no real users. Explicitly documented in SECURITY.md as
not production-grade (no email verification, no rate limiting, no MFA, no SSO).

**Rejected**: Keycloak / Auth0 / NextAuth with OAuth providers — adds real infra and third-party
accounts for no demo benefit; documented as the Phase 2 path.
