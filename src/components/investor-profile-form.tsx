"use client";

import { useActionState } from "react";
import { updateInvestorProfileAction } from "@/lib/actions/profile";
import { SECTOR_TIER1, STAGES, GEOGRAPHIES } from "@/lib/taxonomy";
import { FormError } from "@/components/ui";

export type InvestorProfileFormValues = {
  thesis: string;
  sectors: string[];
  stages: string[];
  geography: string[];
  checkSizeMinUsd: number;
  checkSizeMaxUsd: number;
};

const chipClass =
  "flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs has-[:checked]:border-[var(--color-navy)] has-[:checked]:bg-[var(--color-navy)] has-[:checked]:text-white";
const inputClass =
  "mt-1 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-navy)]";

export function InvestorProfileForm({ initial, welcome }: { initial: InvestorProfileFormValues; welcome?: boolean }) {
  const [state, formAction] = useActionState(updateInvestorProfileAction, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-6">
      {welcome && (
        <p className="rounded-md border border-[var(--color-navy)]/20 bg-[var(--color-slate-soft)] px-4 py-3 text-sm text-[var(--color-ink)]">
          Welcome — set up your investment thesis so match scores and the browse feed can be
          personalized to you.
        </p>
      )}
      <FormError message={state?.error} />

      <div>
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="thesis">
          Investment thesis
        </label>
        <textarea id="thesis" name="thesis" defaultValue={initial.thesis} rows={4} required className={inputClass} />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--color-ink)]">Target sectors</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SECTOR_TIER1.map((s) => (
            <label key={s} className={chipClass}>
              <input type="checkbox" name="sectors" value={s} defaultChecked={initial.sectors.includes(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--color-ink)]">Target stages</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <label key={s.value} className={chipClass}>
              <input type="checkbox" name="stages" value={s.value} defaultChecked={initial.stages.includes(s.value)} className="sr-only" />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--color-ink)]">Target geographies</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {GEOGRAPHIES.map((g) => (
            <label key={g} className={chipClass}>
              <input type="checkbox" name="geography" value={g} defaultChecked={initial.geography.includes(g)} className="sr-only" />
              {g}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="checkSizeMinUsd">
            Min check size (USD)
          </label>
          <input
            id="checkSizeMinUsd"
            name="checkSizeMinUsd"
            type="number"
            min={0}
            step={1000}
            defaultValue={initial.checkSizeMinUsd}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="checkSizeMaxUsd">
            Max check size (USD)
          </label>
          <input
            id="checkSizeMaxUsd"
            name="checkSizeMaxUsd"
            type="number"
            min={0}
            step={1000}
            defaultValue={initial.checkSizeMaxUsd}
            required
            className={inputClass}
          />
        </div>
      </div>

      <button type="submit" className="rounded-md bg-[var(--color-navy)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-navy-soft)]">
        Save profile
      </button>
    </form>
  );
}
