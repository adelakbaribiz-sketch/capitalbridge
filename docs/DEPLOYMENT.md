# Deployment

## Current status: **not deployed**. Local-only, runnable via `npm run dev` / `npm run build && npm run start`.

## Local production build

```bash
npm install
npm run db:push
npm run db:seed   # optional, for demo data
npm run build
npm run start      # http://localhost:3000
```

## Environment variables

See [.env.example](../.env.example):

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | SQLite file path locally (`file:./dev.db`). Point at a Postgres URL to use Postgres instead — see ARCHITECTURE.md. |
| `JWT_SECRET` | yes | Random secret used to sign session cookies. Generate a fresh one for any shared/hosted environment; never reuse the value checked into `.env.example`. |

## If deploying for real (not done here)

- **SQLite is a single-file database and does not work on most serverless/multi-instance hosts**
  (e.g. Vercel's default runtime is ephemeral and stateless per invocation). Switch to Postgres
  first (see ARCHITECTURE.md's "path to Postgres" section) before deploying anywhere that isn't a
  single long-running server or container with a persistent volume.
- A platform like Railway, Fly.io, or a plain VM/container with a persistent disk can run this as
  a Node server (`npm run build && npm run start`) with SQLite on an attached volume, but Postgres
  is still the safer default for anything beyond a personal demo.
- No CI/CD pipeline is configured to auto-deploy; see [TESTING.md](TESTING.md) for what CI does
  run (build, lint, tests) on every push, without deploying anywhere.
- No domain, TLS certificate, or hosting account exists for this project.
