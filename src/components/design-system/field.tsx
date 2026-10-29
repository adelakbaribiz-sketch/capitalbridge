import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

// Was 5 copies of the same input className string (login, signup, new
// listing, investor profile, browse filters). One definition now, so a
// future visual tweak (e.g. a validation-error ring) happens in one place.

const CONTROL =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm outline-none transition-colors duration-[var(--motion-fast)] focus:border-[var(--color-navy)]";
const LABEL = "text-sm font-medium text-[var(--color-ink)]";

function Wrapper({
  label,
  htmlFor,
  hint,
  wrapperClassName,
  children,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  wrapperClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className={LABEL} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      <div className={label ? "mt-1" : undefined}>{children}</div>
      {hint && <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{hint}</p>}
    </div>
  );
}

type FieldExtras = { label?: string; hint?: string; wrapperClassName?: string };

export function TextField({
  label,
  hint,
  wrapperClassName,
  className,
  id,
  ...props
}: FieldExtras & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper label={label} htmlFor={id} hint={hint} wrapperClassName={wrapperClassName}>
      <input id={id} className={`${CONTROL} ${className ?? ""}`} {...props} />
    </Wrapper>
  );
}

export function TextareaField({
  label,
  hint,
  wrapperClassName,
  className,
  id,
  ...props
}: FieldExtras & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper label={label} htmlFor={id} hint={hint} wrapperClassName={wrapperClassName}>
      <textarea id={id} className={`${CONTROL} ${className ?? ""}`} {...props} />
    </Wrapper>
  );
}

export function SelectField({
  label,
  hint,
  wrapperClassName,
  className,
  id,
  children,
  ...props
}: FieldExtras & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper label={label} htmlFor={id} hint={hint} wrapperClassName={wrapperClassName}>
      <select id={id} className={`${CONTROL} ${className ?? ""}`} {...props}>
        {children}
      </select>
    </Wrapper>
  );
}

/** Checkbox styled as a selectable pill — used for sector/stage/geography multi-select. */
export function Chip({
  className,
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { children: ReactNode }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs transition-colors duration-[var(--motion-fast)] has-[:checked]:border-[var(--color-navy-fill)] has-[:checked]:bg-[var(--color-navy-fill)] has-[:checked]:text-white ${className ?? ""}`}
    >
      <input type="checkbox" className="sr-only" {...props} />
      {children}
    </label>
  );
}
