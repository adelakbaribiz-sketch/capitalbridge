// Demo/seed data only. None of these people, companies, or figures are
// real — see docs/DEMO.md. Run with `npm run db:seed`.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function json(values: string[]): string {
  return JSON.stringify(values);
}

async function main() {
  await prisma.listingView.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.investorProfile.deleteMany();
  await prisma.user.deleteMany();

  const demoPasswordHash = await bcrypt.hash("demo1234", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Priya Admin",
      email: "admin@capitalbridge.demo",
      passwordHash: demoPasswordHash,
      role: "ADMIN",
    },
  });

  const founders = await Promise.all(
    [
      { name: "Dana Reyes", email: "dana@arclight.demo" },
      { name: "Wei Chen", email: "wei@meridianhealth.demo" },
      { name: "Amara Obi", email: "amara@cropsense.demo" },
      { name: "Lukas Berg", email: "lukas@ledgerly.demo" },
    ].map((f) =>
      prisma.user.create({
        data: { ...f, passwordHash: demoPasswordHash, role: "FOUNDER" },
      }),
    ),
  );
  const [danaReyes, weiChen, amaraObi, lukasBerg] = founders;

  const investorSeed = [
    {
      name: "Sofia Marín",
      email: "sofia@northbridgevc.demo",
      thesis:
        "Early-stage B2B software and applied AI in North America and Europe. I like founders with 2-3 years of domain depth and early signs of usage-based pull.",
      sectors: ["Artificial Intelligence & ML", "Enterprise SaaS & B2B Software"],
      stages: ["PRE_SEED", "SEED"],
      geography: ["United States", "Canada", "United Kingdom", "European Union"],
      checkSizeMinUsd: 50_000,
      checkSizeMaxUsd: 400_000,
      verifiedDemo: true,
    },
    {
      name: "Tomasz Kowalski",
      email: "tomasz@greenfieldcapital.demo",
      thesis:
        "Climate and agriculture infrastructure with a path to real unit economics, not just a carbon story. Seed through Series A.",
      sectors: ["ClimateTech & Energy", "AgriTech & Food Systems"],
      stages: ["SEED", "SERIES_A"],
      geography: ["United States", "European Union", "Brazil"],
      checkSizeMinUsd: 100_000,
      checkSizeMaxUsd: 1_500_000,
      verifiedDemo: true,
    },
    {
      name: "Grace Okafor",
      email: "grace@lagosangels.demo",
      thesis: "Fintech and healthtech founders building for underserved markets in Africa and the Gulf.",
      sectors: ["Fintech & Financial Infrastructure", "HealthTech & Life Sciences"],
      stages: ["PRE_SEED", "SEED"],
      geography: ["Nigeria", "United Arab Emirates", "United Kingdom"],
      checkSizeMinUsd: 25_000,
      checkSizeMaxUsd: 150_000,
      verifiedDemo: false,
    },
  ];

  const investors = [];
  for (const inv of investorSeed) {
    const user = await prisma.user.create({
      data: {
        name: inv.name,
        email: inv.email,
        passwordHash: demoPasswordHash,
        role: "INVESTOR",
        investorProfile: {
          create: {
            thesis: inv.thesis,
            sectorsJson: json(inv.sectors),
            stagesJson: json(inv.stages),
            geographyJson: json(inv.geography),
            checkSizeMinUsd: inv.checkSizeMinUsd,
            checkSizeMaxUsd: inv.checkSizeMaxUsd,
            verifiedDemo: inv.verifiedDemo,
          },
        },
      },
    });
    investors.push(user);
  }
  const [sofia, tomasz, grace] = investors;

  const listings = await Promise.all([
    prisma.listing.create({
      data: {
        founderId: danaReyes.id,
        companyName: "Arclight Robotics",
        tagline: "Warehouse picking robots that pay for themselves in 9 months",
        description:
          "Arclight builds retrofit robotic picking arms for mid-size 3PL warehouses. We integrate with existing WMS software in under two weeks and charge per pick, not per unit sold, so customers never pay for idle hardware.\n\nWe are 14 months in, with 3 paid pilot sites and a fourth signed for next quarter.",
        sectorTier1: "Manufacturing & Industrial",
        sectorTier2Json: json(["Robotics", "Industrial IoT"]),
        stage: "SEED",
        raiseType: "SAFE",
        askAmountUsd: 1_800_000,
        currency: "USD",
        geography: "United States",
        teamSize: 9,
        tractionSummary: "3 paid pilots live, $46K MRR, 4th site signed for Q1",
        websiteUrl: "https://example.com/arclight",
        status: "PUBLISHED",
      },
    }),
    prisma.listing.create({
      data: {
        founderId: weiChen.id,
        companyName: "Meridian Health",
        tagline: "Async triage for specialty clinics, built with the clinicians who use it",
        description:
          "Meridian lets specialty clinics (dermatology, cardiology) run structured async intake so patients spend less time in the waiting room and clinicians spend less time on low-acuity visits. We are HIPAA-compliant and integrate with three major EHRs.",
        sectorTier1: "HealthTech & Life Sciences",
        sectorTier2Json: json(["Digital Health", "Clinical Ops"]),
        stage: "SERIES_A",
        raiseType: "EQUITY",
        askAmountUsd: 6_500_000,
        currency: "USD",
        geography: "United States",
        teamSize: 22,
        tractionSummary: "38 clinics live, $410K ARR, 92% clinic retention",
        websiteUrl: "https://example.com/meridian-health",
        status: "PUBLISHED",
      },
    }),
    prisma.listing.create({
      data: {
        founderId: amaraObi.id,
        companyName: "CropSense",
        tagline: "Soil-sensor network and yield model for smallholder cooperatives",
        description:
          "CropSense combines a low-cost soil sensor with a yield-prediction model trained on regional agronomic data, sold through farming cooperatives rather than direct-to-farmer. We are live with two cooperatives covering 1,400 hectares.",
        sectorTier1: "AgriTech & Food Systems",
        sectorTier2Json: json(["Precision Ag", "Farm Robotics"]),
        stage: "PRE_SEED",
        raiseType: "SAFE",
        askAmountUsd: 450_000,
        currency: "USD",
        geography: "Brazil",
        teamSize: 5,
        tractionSummary: "2 cooperatives, 1,400 hectares under monitoring",
        websiteUrl: "https://example.com/cropsense",
        status: "PUBLISHED",
      },
    }),
    prisma.listing.create({
      data: {
        founderId: lukasBerg.id,
        companyName: "Ledgerly",
        tagline: "Embedded bookkeeping for vertical SaaS marketplaces",
        description:
          "Ledgerly is an embeddable bookkeeping API that vertical marketplaces (construction, home services) plug in so their sellers get real-time books without leaving the marketplace app. Usage-based pricing, live with two marketplace partners.",
        sectorTier1: "Fintech & Financial Infrastructure",
        sectorTier2Json: json(["Embedded Finance"]),
        stage: "SEED",
        raiseType: "CONVERTIBLE_NOTE",
        askAmountUsd: 1_200_000,
        currency: "USD",
        geography: "European Union",
        teamSize: 7,
        tractionSummary: "2 marketplace partners, 640 seller accounts live",
        websiteUrl: "https://example.com/ledgerly",
        status: "PUBLISHED",
      },
    }),
    // One unpublished draft so the founder dashboard has a non-trivial empty/draft state to show.
    prisma.listing.create({
      data: {
        founderId: danaReyes.id,
        companyName: "Arclight Robotics — European Expansion",
        tagline: "Draft: follow-on raise for EU warehouse rollout",
        description: "Draft listing, not yet published.",
        sectorTier1: "Manufacturing & Industrial",
        sectorTier2Json: json(["Robotics"]),
        stage: "SERIES_A",
        raiseType: "EQUITY",
        askAmountUsd: 4_000_000,
        currency: "EUR",
        geography: "European Union",
        status: "DRAFT",
      },
    }),
  ]);
  const [arclight, meridian, cropsense, ledgerly] = listings;

  // Real (non-seeded-count) engagement signal: log some listing views.
  const viewers = [sofia.id, tomasz.id, grace.id, null, null];
  for (const listing of [arclight, meridian, cropsense, ledgerly]) {
    for (const viewerId of viewers) {
      await prisma.listingView.create({ data: { listingId: listing.id, viewerId } });
    }
  }

  await prisma.interest.createMany({
    data: [
      { listingId: arclight.id, investorId: sofia.id, score: 45, status: "INTERESTED" },
      { listingId: ledgerly.id, investorId: sofia.id, score: 85, status: "INTERESTED" },
      { listingId: cropsense.id, investorId: tomasz.id, score: 78, status: "INTERESTED" },
      { listingId: meridian.id, investorId: grace.id, score: 60, status: "INTERESTED" },
    ],
  });

  console.log("Seed complete:", {
    admin: admin.email,
    founders: founders.map((f) => f.email),
    investors: investors.map((i) => i.email),
    listings: listings.map((l) => l.companyName),
    demoPassword: "demo1234",
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
