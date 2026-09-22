import { describe, expect, it } from "vitest";
import { computeMatchScore } from "@/lib/match";

const baseInvestor = {
  sectors: ["Fintech & Financial Infrastructure"],
  stages: ["SEED"],
  checkSizeMinUsd: 50_000,
  checkSizeMaxUsd: 250_000,
  geography: ["United States"],
};

const baseListing = {
  sectorTier1: "Fintech & Financial Infrastructure",
  stage: "SEED",
  askAmountUsd: 1_000_000,
  geography: "United States",
};

describe("computeMatchScore", () => {
  it("scores a perfect match at 100 with all factors maxed", () => {
    const result = computeMatchScore({ investor: baseInvestor, listing: baseListing });
    expect(result.score).toBe(100);
    expect(result.band).toBe("Strong");
    expect(result.factors.every((f) => f.points === f.maxPoints)).toBe(true);
  });

  it("scores zero sector, stage, and geography points when nothing overlaps", () => {
    const result = computeMatchScore({
      investor: { ...baseInvestor, sectors: ["ClimateTech & Energy"], stages: ["GROWTH"], geography: ["Brazil"] },
      listing: baseListing,
    });
    const byLabel = Object.fromEntries(result.factors.map((f) => [f.label, f.points]));
    expect(byLabel["Sector fit"]).toBe(0);
    expect(byLabel["Stage fit"]).toBe(0);
    expect(byLabel["Geography fit"]).toBe(0);
  });

  it("gives full check-size credit when the investor's range overlaps the typical check band", () => {
    // Typical check band for a $1,000,000 ask is [$20,000, $500,000]; investor range [50k,250k] is fully inside it.
    const result = computeMatchScore({ investor: baseInvestor, listing: baseListing });
    const checkFactor = result.factors.find((f) => f.label === "Check size fit")!;
    expect(checkFactor.points).toBe(checkFactor.maxPoints);
  });

  it("gives zero check-size credit when the investor's range is far outside the typical band", () => {
    const result = computeMatchScore({
      investor: { ...baseInvestor, checkSizeMinUsd: 5_000_000, checkSizeMaxUsd: 10_000_000 },
      listing: baseListing,
    });
    const checkFactor = result.factors.find((f) => f.label === "Check size fit")!;
    expect(checkFactor.points).toBe(0);
  });

  it("assigns match bands consistently with the documented thresholds", () => {
    expect(computeMatchScore({ investor: baseInvestor, listing: baseListing }).band).toBe("Strong");

    const missingGeography = computeMatchScore({
      investor: { ...baseInvestor, geography: ["Brazil"] }, // loses the 15-pt geography factor -> 85
      listing: baseListing,
    });
    expect(missingGeography.score).toBe(85);
    expect(missingGeography.band).toBe("Strong");

    const weak = computeMatchScore({
      investor: { ...baseInvestor, sectors: ["ClimateTech & Energy"], stages: ["GROWTH"], geography: ["Brazil"] },
      listing: baseListing,
    });
    expect(weak.score).toBeLessThan(40);
    expect(weak.band).toBe("Weak");
  });

  it("is a pure function: same input always produces the same output", () => {
    const a = computeMatchScore({ investor: baseInvestor, listing: baseListing });
    const b = computeMatchScore({ investor: baseInvestor, listing: baseListing });
    expect(a).toEqual(b);
  });
});
