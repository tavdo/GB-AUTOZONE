"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<AppLocale, string> = {
  ka: "KA",
  en: "EN",
  ru: "RU",
};

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-md border border-[var(--border)] p-1">
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          className={cn(
            "min-w-9 rounded-sm px-2 py-1 text-xs font-semibold tracking-wide transition-colors",
            locale === code
              ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
              : "text-[var(--muted)] hover:text-white",
          )}
          aria-pressed={locale === code}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
