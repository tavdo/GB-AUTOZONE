import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">
            GB<span className="text-[var(--accent)]">Autozone</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            {t("blurb")}
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            {t("links")}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/cars" className="hover:text-[var(--accent)]">
                {nav("cars")}
              </Link>
            </li>
            <li>
              <Link href="/parts" className="hover:text-[var(--accent)]">
                {nav("parts")}
              </Link>
            </li>
            <li>
              <Link href="/request-quote" className="hover:text-[var(--accent)]">
                {nav("requestQuote")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            {t("legal")}
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shipping-info" className="hover:text-[var(--accent)]">
                {nav("shipping")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--accent)]">
                {nav("about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--accent)]">
                {nav("contact")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <p className="container-page py-4 text-xs text-[var(--muted)]">
          {t("rights", { year })}
        </p>
      </div>
    </footer>
  );
}
