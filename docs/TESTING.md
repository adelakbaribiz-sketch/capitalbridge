# Testing

## What actually has automated coverage

`src/lib/__tests__/match.test.ts` and `src/lib/__tests__/json-list.test.ts` (Vitest) — the two
pieces of pure business logic in this codebase: the compatibility scorer and the SQLite
array-as-JSON helpers. Run with:

```bash
npm test
```

## What is checked, but only manually (see PASS/FIXED/REMAINING below)

- Every page route renders without a server error (`npm run build` exercises this — Next.js fails
  the build on unhandled render errors in most cases, though not all runtime-only bugs).
- The full demo walkthrough in [DEMO.md](DEMO.md) was run manually end to end: signup (both
  roles), login, listing creation (draft + publish), browse + filters, match score display,
  express interest, comparison tool, founder dashboard, admin moderation, both concept-preview
  pages, and the limitations page.
- Responsive layout was checked at 375px, 768px, and desktop widths.

## What is NOT covered

- No component/UI tests (React Testing Library, Playwright) — only the pure-logic unit tests
  above and manual verification.
- No integration tests against the actual database (the unit tests test pure functions only, not
  Server Actions or Prisma queries).
- No load/performance testing.
- No accessibility audit tool run (axe, Lighthouse) — only manual keyboard/label checks.

## CI

[.github/workflows/ci.yml](../.github/workflows/ci.yml) runs on every push/PR to `main`:
`npm ci` → `prisma generate` → `prisma db push` → `npm run lint` → `npm test` → `npm run build`.
It does not deploy anywhere — see [DEPLOYMENT.md](DEPLOYMENT.md).

## Pre-delivery check (this pass)

| Check | Result |
|---|---|
| `npm run build` | **PASSED** |
| `npm run lint` | 1 error found (`no-html-link-for-pages` in `listings/page.tsx`) — **FIXED** (swapped `<a>` for `next/link`) |
| `npm test` | **PASSED** (10 unit tests) |
| Manual walkthrough (all roles, all pages) | **PASSED** |
| Security review (see SECURITY.md) | **PASSED** — no `dangerouslySetInnerHTML`, no raw SQL, no committed secrets |
| Remaining known issues | None blocking; see [LIMITATIONS.md](LIMITATIONS.md) for scope gaps that are intentional, not bugs |
