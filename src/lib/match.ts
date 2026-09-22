// Deterministic, explainable compatibility score between an investor
// profile and a listing. This is a rule-based heuristic, not a trained
// model — no embeddings, no LLM call, nothing learned from data. It exists
// to give the "AI Match Engine" feature from the source dossier an honest,
// working stand-in. See docs/DECISIONS.md D3 for why.
//
// Weights sum to 100 and were chosen (not fit to data) to roughly mirror
// the dossier's stated factors: sector fit matters most, then stage and
// check size, then geography.

export type MatchInput = {
  investor: {
    sectors: string[]; // Tier-1 sector names the investor targets
    stages: string[]; // Stage enum values the investor targets
    checkSizeMinUsd: number;
    checkSizeMaxUsd: number;
    geography: string[];
  };
  listing: {
    sectorTier1: string;
    stage: string;
    askAmountUsd: number;
    geography: string;
  };
};

export type MatchFactor = {
  label: string;
  points: number;
  maxPoints: number;
  detail: string;
};

export type MatchResult = {
  score: number; // 0-100
  band: "Strong" | "Promising" | "Possible" | "Weak";
  factors: MatchFactor[];
};

const WEIGHTS = { sector: 35, stage: 25, checkSize: 25, geography: 15 } as const;

export function computeMatchScore({ investor, listing }: MatchInput): MatchResult {
  const factors: MatchFactor[] = [];

  const sectorMatch = investor.sectors.includes(listing.sectorTier1);
  factors.push({
    label: "Sector fit",
    points: sectorMatch ? WEIGHTS.sector : 0,
    maxPoints: WEIGHTS.sector,
    detail: sectorMatch
      ? `${listing.sectorTier1} is in this investor's target sectors.`
      : `${listing.sectorTier1} is not in this investor's target sectors.`,
  });

  const stageMatch = investor.stages.includes(listing.stage);
  factors.push({
    label: "Stage fit",
    points: stageMatch ? WEIGHTS.stage : 0,
    maxPoints: WEIGHTS.stage,
    detail: stageMatch
      ? "This listing's stage matches the investor's target stages."
      : "This listing's stage is outside the investor's target stages.",
  });

  // A round's "typical single check" is modeled as 2%-50% of the total ask.
  // This is a simplifying assumption, not a market statistic.
  const typicalCheckLow = listing.askAmountUsd * 0.02;
  const typicalCheckHigh = listing.askAmountUsd * 0.5;
  const overlaps =
    investor.checkSizeMaxUsd >= typicalCheckLow && investor.checkSizeMinUsd <= typicalCheckHigh;
  const near =
    !overlaps &&
    (Math.abs(investor.checkSizeMinUsd - typicalCheckHigh) <= typicalCheckHigh ||
      Math.abs(typicalCheckLow - investor.checkSizeMaxUsd) <= typicalCheckLow);
  const checkPoints = overlaps ? WEIGHTS.checkSize : near ? Math.round(WEIGHTS.checkSize * 0.4) : 0;
  factors.push({
    label: "Check size fit",
    points: checkPoints,
    maxPoints: WEIGHTS.checkSize,
    detail: overlaps
      ? "Investor's check range overlaps this round's typical check size."
      : near
        ? "Investor's check range is close to, but not squarely inside, this round's typical check size."
        : "Investor's check range does not overlap this round's typical check size.",
  });

  const geoMatch = investor.geography.includes(listing.geography);
  factors.push({
    label: "Geography fit",
    points: geoMatch ? WEIGHTS.geography : 0,
    maxPoints: WEIGHTS.geography,
    detail: geoMatch
      ? `${listing.geography} is in this investor's target geographies.`
      : `${listing.geography} is not in this investor's target geographies.`,
  });

  const score = factors.reduce((sum, f) => sum + f.points, 0);
  const band: MatchResult["band"] =
    score >= 80 ? "Strong" : score >= 60 ? "Promising" : score >= 40 ? "Possible" : "Weak";

  return { score, band, factors };
}
