# API

There is no public REST/GraphQL API in this build — see [DECISIONS.md](DECISIONS.md) (D1). All
mutations go through Next.js Server Actions, which are not externally callable HTTP endpoints;
they exist only as functions imported by the app's own forms/components.

## Server Actions (the closest equivalent to an API surface)

| Action | File | Auth required | Effect |
|---|---|---|---|
| `signupAction` | `src/lib/actions/auth.ts` | none | Creates a `User` (+ `InvestorProfile` if role=INVESTOR), sets session cookie |
| `loginAction` | `src/lib/actions/auth.ts` | none | Verifies credentials, sets session cookie |
| `logoutAction` | `src/lib/actions/auth.ts` | any | Clears session cookie |
| `createListingAction` | `src/lib/actions/listings.ts` | FOUNDER | Creates a `Listing` (draft or published) |
| `setListingStatusAction` | `src/lib/actions/listings.ts` | owner FOUNDER or ADMIN | Updates a listing's `status` |
| `expressInterestAction` | `src/lib/actions/listings.ts` | INVESTOR | Upserts an `Interest` row with a freshly computed score |
| `updateInvestorProfileAction` | `src/lib/actions/profile.ts` | INVESTOR | Updates the caller's `InvestorProfile` |

Every action re-checks the session and role **server-side** (never trusts client-provided role
claims) before touching the database — see [SECURITY.md](SECURITY.md).

## If a real API is added later (ROADMAP)

The dossier envisions REST + GraphQL for external/institutional integrations (F-features around
CRM, reporting exports, partner APIs). None of that exists here. Adding it later means introducing
`src/app/api/**/route.ts` handlers (or a separate service) that call the same Prisma models and
the same `computeMatchScore` / `getSession` helpers this app already uses — the business logic
does not need to be rewritten, only exposed over HTTP with its own auth (API keys / OAuth) and
rate limiting.
