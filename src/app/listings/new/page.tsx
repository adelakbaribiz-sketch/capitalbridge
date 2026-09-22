"use client";

import { useActionState, useState } from "react";
import { createListingAction } from "@/lib/actions/listings";
import { SECTOR_TIER1, SECTOR_TIER2, STAGES, RAISE_TYPES, GEOGRAPHIES, type SectorTier1 } from "@/lib/taxonomy";
import { FormError } from "@/components/ui";

const inputClass =
  "mt-1 w-full rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-navy)]";
const labelClass = "text-sm font-medium text-[var(--color-ink)]";

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

        <div>
          <label className={labelClass} htmlFor="companyName">
            Company name
          </label>
          <input id="companyName" name="companyName" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="tagline">
            One-line tagline
          </label>
          <input id="tagline" name="tagline" required maxLength={160} className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Description
          </label>
          <textarea id="description" name="description" required rows={6} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="sectorTier1">
              Primary sector
            </label>
            <select
              id="sectorTier1"
              name="sectorTier1"
              value={tier1}
              onChange={(e) => setTier1(e.target.value as SectorTier1)}
              className={inputClass}
            >
              {SECTOR_TIER1.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="stage">
              Stage
            </label>
            <select id="stage" name="stage" className={inputClass}>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>Sub-sector tags (optional, up to 6)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SECTOR_TIER2[tier1].map((tag) => (
              <label
                key={tag}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs has-[:checked]:border-[var(--color-navy)] has-[:checked]:bg-[var(--color-navy)] has-[:checked]:text-white"
              >
                <input type="checkbox" name="sectorTier2" value={tag} className="sr-only" />
                {tag}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="raiseType">
              Instrument
            </label>
            <select id="raiseType" name="raiseType" className={inputClass}>
              {RAISE_TYPES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="askAmountUsd">
              Raise amount (USD)
            </label>
            <input id="askAmountUsd" name="askAmountUsd" type="number" min={10000} step={1000} required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="geography">
              Primary geography
            </label>
            <select id="geography" name="geography" className={inputClass}>
              {GEOGRAPHIES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="teamSize">
              Team size (optional)
            </label>
            <input id="teamSize" name="teamSize" type="number" min={1} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="tractionSummary">
            Traction summary (optional)
          </label>
          <input id="tractionSummary" name="tractionSummary" placeholder="e.g. $40K MRR, 18% MoM growth" className={inputClass} />
        </div>

        <div>
          <label className={labelClass} htmlFor="websiteUrl">
            Website (optional)
          </label>
          <input id="websiteUrl" name="websiteUrl" type="url" placeholder="https://" className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            onClick={() => setIntent("draft")}
            className="rounded-md border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] hover:border-[var(--color-navy)]"
          >
            Save as draft
          </button>
          <button
            type="submit"
            onClick={() => setIntent("publish")}
            className="rounded-md bg-[var(--color-navy)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-navy-soft)]"
          >
            Publish listing
          </button>
        </div>
      </form>
    </div>
  );
}
