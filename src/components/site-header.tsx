import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, ButtonLink } from "@/components/design-system/button";

const NAV_LINKS = [{ href: "/listings", label: "Browse listings" }, { href: "/compare", label: "Compare" }];

export async function SiteHeader() {
  const session = await getSession();

  const dashboardHref =
    session?.role === "FOUNDER"
      ? "/dashboard/founder"
      : session?.role === "INVESTOR"
        ? "/dashboard/investor"
        : session?.role === "ADMIN"
          ? "/admin"
          : null;

  return (
    <header className="relative border-b border-[var(--color-border)] bg-[var(--color-paper-raised)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <MobileNav links={NAV_LINKS} dashboardHref={dashboardHref} />
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl tracking-tight text-[var(--color-navy)]">CapitalBridge</span>
            <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              Demo
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-[var(--color-ink-muted)] md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--color-ink)]">
              {link.label}
            </Link>
          ))}
          {dashboardHref && (
            <Link href={dashboardHref} className="hover:text-[var(--color-ink)]">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {/* On phones the header row is already full; the toggle lives in the mobile menu there. */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          {session ? (
            <>
              <span className="hidden text-[var(--color-ink-muted)] sm:inline">
                {session.name} · {session.role.toLowerCase()}
              </span>
              <form action={logoutAction}>
                <Button type="submit" variant="secondary" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="font-medium text-[var(--color-ink)] hover:underline">
                Sign in
              </Link>
              <ButtonLink href="/signup" size="sm">
                Get started
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
