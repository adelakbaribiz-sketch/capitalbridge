# Contributing

This is a solo portfolio project, not an actively maintained open-source project seeking
contributors — but if you're exploring the code or proposing a change:

1. Read [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md) and [docs/DECISIONS.md](docs/DECISIONS.md)
   first so a PR doesn't re-litigate a documented, intentional scope decision.
2. `npm install && npm run db:push && npm run db:seed && npm run dev` to run locally.
3. Before opening a PR: `npm run lint && npm test && npm run build` should all pass (this mirrors
   [.github/workflows/ci.yml](.github/workflows/ci.yml)).
4. If you add a feature that was previously listed as "not implemented" in
   [docs/LIMITATIONS.md](docs/LIMITATIONS.md), update that doc and
   [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)'s gap table in the same PR — keeping those
   honest is a hard requirement for this repo, not a formality.
5. Never commit real secrets, real user data, or fabricated "results" (fake customers, fake
   revenue, fake test coverage) — see the top of [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md)
   for why that matters here specifically.
