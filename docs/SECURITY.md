# Security

Honest status: this is a demo-grade auth implementation, real enough to demonstrate the pattern,
not ready for real users or real money. Do not point this at a production dataset.

## What's implemented (real)

- **Password storage**: bcrypt (`bcryptjs`, 10 salt rounds) — never stored or logged in plain text.
- **Session**: a JWT (HS256, `jose`) signed with `JWT_SECRET`, stored in an **httpOnly**,
  `sameSite=lax` cookie (and `secure` in production). Not readable from client JS.
- **Authorization checks happen server-side, on every mutation.** Every Server Action calls
  `getSession()` and checks `role` / resource ownership before writing — e.g.
  `setListingStatusAction` verifies the caller is the listing's founder or an admin before it will
  touch the row (`src/lib/actions/listings.ts`). The UI hides buttons a role can't use, but the
  server never trusts that the UI did its job.
- **Input validation**: every Server Action validates `FormData` with Zod (`src/lib/actions/*.ts`)
  before it reaches Prisma — rejects malformed email, short passwords, out-of-range numbers, etc.
- **SQL injection**: not applicable in the direct-query sense — all database access goes through
  Prisma's parameterized query builder, no raw SQL string concatenation anywhere in this repo.
- **XSS**: React escapes all rendered text by default; this repo contains no
  `dangerouslySetInnerHTML`.
- **Secrets**: `.env` is git-ignored; `.env.example` has no real values; `JWT_SECRET` is generated
  fresh per environment, never committed.

## What's NOT implemented (do not assume these exist)

- No email verification on signup — anyone can register with any email string.
- No rate limiting on login/signup — brute-force protection is absent.
- No password reset flow.
- No MFA / SSO / OAuth.
- No CSRF token beyond what Next.js Server Actions provide by default (same-origin POST checks);
  not independently audited here.
- No dependency vulnerability scanning wired into CI yet (see [TESTING.md](TESTING.md)).
- No real KYC/AML/accreditation verification — the `verifiedDemo` flag on `InvestorProfile` is a
  plain boolean seeded by the demo script, not backed by any identity check.
- No file upload surface exists, so there is no file-upload attack surface to review yet — that's
  also why it's not built (see [DECISIONS.md](DECISIONS.md)).
- No payments/escrow integration — correctly out of scope; see DECISIONS.md D5.

## Review performed before delivery

- Grepped for `dangerouslySetInnerHTML`, raw SQL (`$queryRaw`/`$executeRaw`), and hardcoded
  secrets — none found outside the documented `.env.example` placeholder.
- Confirmed every Server Action that mutates data checks `getSession()` before doing so.
- Confirmed `.env` is excluded from git via `.gitignore` and was never staged.
- Confirmed the demo seed password (`demo1234`) is documented as a demo credential everywhere it
  appears (login page, README, DEMO.md) and is not presented as a secret.
