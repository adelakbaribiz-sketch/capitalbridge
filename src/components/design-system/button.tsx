import type { ButtonHTMLAttributes, ComponentProps } from "react";
import Link from "next/link";

// Was 9 copies of near-identical button className strings across pages
// (login, signup, dashboards, listing forms, express-interest). One
// definition now; the subtle lift-on-hover/press-on-click is CSS-only
// (transform + shadow), so it costs nothing on low-power devices and is
// automatically silenced by the prefers-reduced-motion rule in globals.css.

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-navy-fill)] text-white shadow-[var(--shadow-raised)] hover:bg-[var(--color-navy-soft)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
  secondary:
    "border border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-navy)] active:scale-[0.98]",
  ghost: "text-[var(--color-ink)] hover:bg-[var(--color-slate-soft)] active:scale-[0.98]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-[transform,box-shadow,background-color,border-color] duration-[var(--motion-fast)] ease-[var(--motion-ease)] disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0";

export function buttonClassName(variant: ButtonVariant = "primary", size: ButtonSize = "md", className = "") {
  return cx(BASE, SIZES[size], VARIANTS[variant], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: { variant?: ButtonVariant; size?: ButtonSize; href: string; className?: string } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className"
>) {
  return <Link href={href} className={buttonClassName(variant, size, className)} {...props} />;
}
