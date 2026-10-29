"use client";

import { useActionState } from "react";
import { updateInvestorProfileAction } from "@/lib/actions/profile";
import { SECTOR_TIER1, STAGES, GEOGRAPHIES } from "@/lib/taxonomy";
import { FormError } from "@/components/ui";
import { TextareaField, TextField, Chip } from "@/components/design-system/field";
import { Button } from "@/components/design-system/button";

export type InvestorProfileFormValues = {
  thesis: string;
  sectors: string[];
  stages: string[];
  geography: string[];
  checkSizeMinUsd: number;
  checkSizeMaxUsd: number;
};

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

      <TextareaField label="Investment thesis" id="thesis" name="thesis" defaultValue={initial.thesis} rows={4} required />

      <fieldset>
        <legend className="text-sm font-medium text-[var(--color-ink)]">Target sectors</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SECTOR_TIER1.map((s) => (
            <Chip key={s} name="sectors" value={s} defaultChecked={initial.sectors.includes(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--color-ink)]">Target stages</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <Chip key={s.value} name="stages" value={s.value} defaultChecked={initial.stages.includes(s.value)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-[var(--color-ink)]">Target geographies</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {GEOGRAPHIES.map((g) => (
            <Chip key={g} name="geography" value={g} defaultChecked={initial.geography.includes(g)}>
              {g}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Min check size (USD)"
          id="checkSizeMinUsd"
          name="checkSizeMinUsd"
          type="number"
          min={0}
          step={1000}
          defaultValue={initial.checkSizeMinUsd}
          required
        />
        <TextField
          label="Max check size (USD)"
          id="checkSizeMaxUsd"
          name="checkSizeMaxUsd"
          type="number"
          min={0}
          step={1000}
          defaultValue={initial.checkSizeMaxUsd}
          required
        />
      </div>

      <Button type="submit">Save profile</Button>
    </form>
  );
}
