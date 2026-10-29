# Changelog

## Unreleased

**Added**
- Dark theme. Colors are CSS variables in `globals.css`, with a `[data-theme="dark"]` override. A small inline
  script in `layout.tsx` applies the stored choice (or the OS preference) before first paint, so there's no
  light flash. The toggle sits in the header on desktop and in the mobile menu on phones.
- `--color-navy-fill` / `--color-hero` tokens: in dark mode, navy text and navy-filled buttons need different
  colors, so fills no longer reuse the text token. Inputs use `--color-paper-raised` instead of hard-coded white.
- README screenshots recaptured in the dark theme.

## 0.1.0 — initial MVP

Built from the source Technical Project Dossier (see [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)).

**Added**
- Founder/investor/admin auth, listing CRUD, investor profiles
- Rule-based compatibility scoring with an explainable factor breakdown
- Browse/filter/search, 3-way comparison tool
- Founder dashboard with real view/interest counts and a views-by-day chart
- Admin moderation panel
- Concept-preview screens for auction/bidding and contract drafting
- Seed data, demo accounts, full documentation set (this `docs/` folder)
- Unit tests for the scoring engine and JSON-list helpers; CI workflow (build/lint/test)

**Known gaps at this version**: see [LIMITATIONS.md](LIMITATIONS.md) and [ROADMAP.md](ROADMAP.md).
