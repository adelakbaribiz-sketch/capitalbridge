# Project Context

## Origin

This project was created from a **Technical Project Dossier** describing "CapitalBridge" — a
proposed global, dual-sided marketplace connecting startup/SME/real-estate/fund founders with
investors, positioned to be more complete than incumbents such as AngelList, Republic,
SeedInvest, OpenVC, Gust, StartEngine, Forge, EquityZen, and F6S.

The dossier itself is explicit that the project was, at the time it was written, **0% implemented**:
no code, no repository, no MVP, no validated market data — a business concept and architecture
sketch only, with every feature tagged `PROPOSED`. This repository is the first real
implementation slice built from that concept.

## Classification

Per the project-type taxonomy used to scope this work:

**Primary: C. SAAS** — multi-sided (founder ⇄ investor) B2B/B2C marketplace platform.
**Secondary lens: B. AI PRODUCT** — the dossier's headline differentiator is an "AI-powered
match engine." No Hybrid outputs (research package, trading strategy, manuscript) apply — the
dossier contains no research question, dataset, or trading logic.

The dossier's own "AI Match Engine" (embeddings, LLM-driven scoring, fraud detection, NLP
auto-tagging) is **not implemented** here. What this repository ships instead is a transparent,
deterministic **rule-based compatibility scorer** (sector/stage/check-size/geography overlap) —
real, working code, but explicitly *not* machine learning. See [DECISIONS.md](DECISIONS.md).

## What "CapitalBridge" means in this repository

The dossier already named the product ("CapitalBridge, working title") and described its
positioning in real detail (competitor table, fee model, verticals, personas), so unlike a
fully blank-slate concept, this repository keeps that name and premise. What had to be
**invented or simplified** to turn a 40-page architecture memo into a buildable MVP is disclosed
below and in [DECISIONS.md](DECISIONS.md).

**"CapitalBridge" as implemented here is a portfolio/demo product. No real company, investor,
capital raise, regulatory license, or compliance certification exists.** Every screen showing
data not created live through the app is labeled `DEMO DATA` in this documentation and in the UI.

## Gap analysis — dossier scope vs. this MVP

The source dossier lists 20 features (F1–F20) across founder tools, investor tools, compliance,
execution, and reporting. Building all 20 at production depth (multi-jurisdiction KYC/AML,
escrow, e-signature, auction clearing, LLM contract drafting, an 8-source scraping pipeline) is a
multi-quarter, multi-engineer effort — not something an honest single MVP pass can claim to ship.
This build follows the stated MVP philosophy: **maximum credible frontend + minimum necessary,
real backend**, with everything else either a clearly labeled concept preview or left out and
tracked in [ROADMAP.md](ROADMAP.md).

| Dossier feature | Status in this repo | Notes |
|---|---|---|
| F1 Listing Creation & Management | **REAL** | Multi-step form, persisted to DB. Document upload is filename-only (no file storage backend). |
| F2 Investor Profiles | **REAL** | Thesis, stage, check size, geography, sectors — persisted. |
| F3 AI Match Engine | **SIMULATED (real code, not AI)** | Deterministic weighted scorer, computed server-side per request. Explicitly not ML — see DECISIONS.md. |
| F9 Peer Comparison Engine | **REAL** | Compare up to 3 published listings side by side. |
| F10 Advanced Screening Filters | **REAL** | Sector/stage/geography/check-size filters on the browse page. |
| F14 Investor Reporting Dashboards | **PARTIAL** | Founder dashboard shows engagement charts; underlying view/interest counts are real, historical trend data is seeded `DEMO DATA`. |
| F17 Admin Panel | **REAL (minimal)** | Publish/unpublish listings, view users. No dispute resolution workflow. |
| F4 Compliance-as-a-Service | **NOT IMPLEMENTED** | Concept preview screen only. "Verified" badges in demo data are a boolean flag, not a real KYC/AML check. |
| F5 Deal Room | **NOT IMPLEMENTED** | "Express interest" records intent; no document vault, e-signature, or escrow. |
| F6 Investor CRM | **NOT IMPLEMENTED** | Roadmap. |
| F7 Multi-currency / multi-language | **PARTIAL** | Currency is a stored/displayed field; no live FX conversion, no i18n. |
| F8 AI Screening Reports | **NOT IMPLEMENTED** | Roadmap. |
| F11 Web Scraping & Data Aggregation | **NOT IMPLEMENTED** | Roadmap; documented data-source list preserved from the dossier. |
| F12 Automated Contract Drafting | **NOT IMPLEMENTED** | Concept preview screen (static UI, no document generation). |
| F13 Auction & Bidding System | **NOT IMPLEMENTED** | Concept preview screen (static UI, no live bidding/clearing engine). |
| F15 Report Generation (PDF/export) | **NOT IMPLEMENTED** | Roadmap. |
| F16 Secondary Market | **NOT IMPLEMENTED** | Dossier itself scopes this to Phase 4. |
| F18 Mobile Application | **NOT IMPLEMENTED** | Responsive web only, no native app. |
| F19 Messaging Service | **NOT IMPLEMENTED** | Roadmap; "express interest" substitutes for real-time chat. |
| F20 Payment / Escrow Service | **NOT IMPLEMENTED** | Correctly out of scope — this project must never move or hold real funds. |

## What is real vs. simulated in this repository

- **Real**: the Next.js application, the Prisma schema and SQLite-backed persistence, the
  listing/investor-profile CRUD flows, the deterministic match-scoring algorithm, session-based
  auth, the comparison tool, the admin moderation actions, and any data created by using the
  running app.
- **Simulated / demo data**: the seed accounts, seed listings, and dashboard trend charts
  (`api's` seed script) used so the product can be demoed without manual data entry. Clearly
  seed fixtures, not production or customer data.
- **Not implemented**: KYC/AML/accreditation verification, e-signature, escrow/payments, the
  auction clearing engine, LLM-based contract drafting, web scraping, and any AI/ML model. Where
  the dossier treats these as headline features, this repo ships a **concept preview** screen
  (clearly labeled, non-functional) instead of pretending they work.

See [LIMITATIONS.md](LIMITATIONS.md) and [DEMO.md](DEMO.md) for the authoritative, up-to-date
statement of what is real versus mocked, and [DECISIONS.md](DECISIONS.md) for why each gap was
closed the way it was.
