import type { MatchResult } from "@/lib/match";

const BAND_STYLES: Record<MatchResult["band"], string> = {
  Strong: "bg-[var(--color-emerald-soft)] text-[var(--color-emerald)]",
  Promising: "bg-[var(--color-amber-soft)] text-[var(--color-amber)]",
  Possible: "bg-[var(--color-slate-soft)] text-[var(--color-ink-muted)]",
  Weak: "bg-[var(--color-rose-soft)] text-[var(--color-rose)]",
};

export function MatchBadge({ score, band }: { score: number; band: MatchResult["band"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${BAND_STYLES[band]}`}
      title="Rule-based compatibility score, not AI/ML — see Limitations"
    >
      <span className="tabular-nums">{score}</span>
      <span className="font-medium">{band} match</span>
    </span>
  );
}
