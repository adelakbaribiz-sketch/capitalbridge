// Industry taxonomy. The source dossier proposed 21 Tier-1 verticals and
// 400+ Tier-2 tags, built up by vertical analysts + NLP auto-tagging over
// time. For an MVP with a handful of seed listings, a 10-vertical subset
// with a few Tier-2 tags each is enough to exercise the same UI (filters,
// sector badges, comparison) without fabricating a taxonomy team's worth of
// curated tags. Extending this list does not require a schema change.

export const SECTOR_TIER1 = [
  "Artificial Intelligence & ML",
  "Fintech & Financial Infrastructure",
  "HealthTech & Life Sciences",
  "Enterprise SaaS & B2B Software",
  "ClimateTech & Energy",
  "AgriTech & Food Systems",
  "Real Estate & PropTech",
  "Consumer & Retail",
  "Education & Workforce",
  "Manufacturing & Industrial",
] as const;

export type SectorTier1 = (typeof SECTOR_TIER1)[number];

export const SECTOR_TIER2: Record<SectorTier1, string[]> = {
  "Artificial Intelligence & ML": ["Applied AI", "MLOps", "Computer Vision", "NLP", "AI Agents"],
  "Fintech & Financial Infrastructure": ["Payments", "Lending", "Embedded Finance", "InsurTech", "WealthTech"],
  "HealthTech & Life Sciences": ["Digital Health", "Diagnostics", "Biotech", "Clinical Ops", "Mental Health"],
  "Enterprise SaaS & B2B Software": ["DevTools", "Vertical SaaS", "Data Infrastructure", "Security", "HR Tech"],
  "ClimateTech & Energy": ["Carbon Removal", "Grid & Storage", "Solar", "Circular Economy", "Climate Risk"],
  "AgriTech & Food Systems": ["Precision Ag", "Alt Protein", "Supply Chain", "Farm Robotics"],
  "Real Estate & PropTech": ["Marketplaces", "Construction Tech", "Property Management", "Real Estate Finance"],
  "Consumer & Retail": ["DTC", "Marketplaces", "Retail Tech", "Creator Economy"],
  "Education & Workforce": ["EdTech", "Upskilling", "Recruiting", "Corporate Learning"],
  "Manufacturing & Industrial": ["Robotics", "Supply Chain", "Industrial IoT", "Advanced Materials"],
};

export const STAGES = [
  { value: "PRE_SEED", label: "Pre-Seed" },
  { value: "SEED", label: "Seed" },
  { value: "SERIES_A", label: "Series A" },
  { value: "SERIES_B_PLUS", label: "Series B+" },
  { value: "GROWTH", label: "Growth" },
] as const;

export const RAISE_TYPES = [
  { value: "SAFE", label: "SAFE" },
  { value: "CONVERTIBLE_NOTE", label: "Convertible Note" },
  { value: "EQUITY", label: "Priced Equity" },
  { value: "REVENUE_SHARE", label: "Revenue Share" },
] as const;

export const GEOGRAPHIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "European Union",
  "Singapore",
  "Australia",
  "United Arab Emirates",
  "Brazil",
  "India",
  "Nigeria",
] as const;

export function stageLabel(value: string): string {
  return STAGES.find((s) => s.value === value)?.label ?? value;
}

export function raiseTypeLabel(value: string): string {
  return RAISE_TYPES.find((r) => r.value === value)?.label ?? value;
}
