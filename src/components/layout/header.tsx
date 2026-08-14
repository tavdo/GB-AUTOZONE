"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/cars", label: t("cars") },
    { href: "/parts", label: t("parts") },
    { href: "/shipping-info", label: t("shipping") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_72%,transparent)] backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            GB<span className="text-[var(--accent)]">Autozone</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link href="/cart" aria-label={t("cart")}>
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/request-quote">{t("requestQuote")}</Link>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-[var(--border)] bg-[var(--surface)] lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="container-page flex flex-col gap-1 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/request-quote"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm font-semibold text-[var(--accent)]"
          >
            {t("requestQuote")}
          </Link>
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm font-medium"
          >
            {t("cart")}
          </Link>
        </div>
      </div>
    </header>
  );
}
