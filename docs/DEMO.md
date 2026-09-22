# Demo Guide

## Run it locally

```bash
npm install
cp .env.example .env      # then edit JWT_SECRET, or leave the generated .env as-is
npm run db:push           # creates prisma/dev.db and applies the schema
npm run db:seed           # loads demo accounts + demo listings
npm run dev                # http://localhost:3000
```

## Demo accounts

All seed accounts use the password **`demo1234`**. None of these are real people.

| Role | Email | Notes |
|---|---|---|
| Founder | `dana@arclight.demo` | Owns "Arclight Robotics" (published) and a draft follow-on listing |
| Founder | `wei@meridianhealth.demo` | Owns "Meridian Health" |
| Founder | `amara@cropsense.demo` | Owns "CropSense" |
| Founder | `lukas@ledgerly.demo` | Owns "Ledgerly" |
| Investor | `sofia@northbridgevc.demo` | Thesis: AI/ML + Enterprise SaaS, US/Canada/UK/EU |
| Investor | `tomasz@greenfieldcapital.demo` | Thesis: ClimateTech + AgriTech |
| Investor | `grace@lagosangels.demo` | Thesis: Fintech + HealthTech, Nigeria/UAE/UK |
| Admin | `admin@capitalbridge.demo` | Full moderation access |

## Suggested walkthrough

1. **Sign in as `sofia@northbridgevc.demo`** → `/dashboard/investor` shows her top matches,
   sorted by score. Open "Ledgerly" (fintech, matches her thesis) and note the visible score
   breakdown, then open "CropSense" (agritech — outside her thesis) and compare the lower score.
2. Click **Express interest** on a listing — it now appears under "Listings you're interested in."
3. Go to **`/compare`**, pick 2–3 listings, and see the side-by-side table.
4. **Sign out, sign in as `dana@arclight.demo`** → `/dashboard/founder` shows real view/interest
   counts (including the view you just generated as Sofia) and a views-by-day chart.
5. **Sign in as `admin@capitalbridge.demo`** → `/admin` to see every user/listing and moderate.
6. Visit **`/concepts/auction`** and **`/concepts/contracts`** to see the labeled concept-preview
   screens for features not yet built, and **`/docs-limitations`** for the full honest-status page.

## Resetting demo data

`npm run db:seed` wipes and re-creates all seed data — safe to re-run any time, including after
you've created your own test accounts/listings through the UI (those get wiped too).
