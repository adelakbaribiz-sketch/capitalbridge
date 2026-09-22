# User Flows (as implemented)

## Founder: publish a listing
```
Sign up (role=Founder) → Founder dashboard (empty state)
  → "New listing" → fill form → Save as draft OR Publish
  → redirected to listing detail page
  → (if published) appears in /listings and investor match feeds immediately
```

## Investor: find and act on a match
```
Sign up (role=Founder is skipped; role=Investor) → redirected to
  /settings/profile?welcome=1 (profile starts empty)
  → fill thesis, sectors, stages, geography, check size → Save
  → /dashboard/investor now shows top matches, sorted by score
  → open a listing → see full factor breakdown → "Express interest"
  → listing now appears under "Listings you're interested in"
```

## Investor: compare before deciding
```
/compare → pick up to 3 published listings from the dropdowns → Compare
  → side-by-side table (sector, stage, instrument, ask, geography, traction)
  → URL is shareable (?slot0=...&slot1=...&slot2=...)
```

## Founder: track engagement
```
/dashboard/founder → stat tiles (published count, total views, total interest)
  → views-by-day chart (built from real ListingView rows)
  → per-listing row: view count, interest count, publish/unpublish/archive controls
```

## Admin: moderate
```
Sign in as admin@capitalbridge.demo → /admin
  → see all users and all listings (any status)
  → publish/unpublish/archive any listing
```

## What's missing from these flows vs. the dossier

No email verification step, no KYC/accreditation step, no deal-room step after "express
interest" (no document sharing, no e-signature, no escrow), no messaging between founder and
investor. See [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for the full gap table and
[ROADMAP.md](ROADMAP.md) for the path to closing each gap.
