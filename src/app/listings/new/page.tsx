"use client";

import { useActionState, useState } from "react";
import { createListingAction } from "@/lib/actions/listings";
import { SECTOR_TIER1, SECTOR_TIER2, STAGES, RAISE_TYPES, GEOGRAPHIES, type SectorTier1 } from "@/lib/taxonomy";
import { FormError } from "@/components/ui";
import { TextField, TextareaField, SelectField, Chip } from "@/components/design-system/field";
import { Button } from "@/components/design-system/button";

export default function NewListingPage() {
  const [state, formAction] = useActionState(createListingAction, undefined);
  const [tier1, setTier1] = useState<SectorTier1>(SECTOR_TIER1[0]);
  const [intent, setIntent] = useState<"draft" | "publish">("draft");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Create a listing</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Document uploads are not implemented in this demo — describe traction in text instead of
        attaching a deck. See docs/LIMITATIONS.md.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <FormError message={state?.error} />
        <input type="hidden" name="intent" value={intent} />

        <TextField label="Company name" id="companyName" name="companyName" required />
        <TextField label="One-line tagline" id="tagline" name="tagline" required maxLength={160} />
        <TextareaField label="Description" id="description" name="description" required rows={6} />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Primary sector"
            id="sectorTier1"
            name="sectorTier1"
            value={tier1}
            onChange={(e) => setTier1(e.target.value as SectorTier1)}
          >
            {SECTOR_TIER1.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </SelectField>
          <SelectField label="Stage" id="stage" name="stage">
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectField>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-[var(--color-ink)]">Sub-sector tags (optional, up to 6)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SECTOR_TIER2[tier1].map((tag) => (
              <Chip key={tag} name="sectorTier2" value={tag}>
                {tag}
              </Chip>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Instrument" id="raiseType" name="raiseType">
            {RAISE_TYPES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Raise amount (USD)"
            id="askAmountUsd"
            name="askAmountUsd"
            type="number"
            min={10000}
            step={1000}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Primary geography" id="geography" name="geography">
            {GEOGRAPHIES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </SelectField>
          <TextField label="Team size (optional)" id="teamSize" name="teamSize" type="number" min={1} />
        </div>

        <TextField
          label="Traction summary (optional)"
          id="tractionSummary"
          name="tractionSummary"
          placeholder="e.g. $40K MRR, 18% MoM growth"
        />
        <TextField label="Website (optional)" id="websiteUrl" name="websiteUrl" type="url" placeholder="https://" />

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="secondary" onClick={() => setIntent("draft")}>
            Save as draft
          </Button>
          <Button type="submit" onClick={() => setIntent("publish")}>
            Publish listing
          </Button>
        </div>
      </form>
    </div>
  );
}
