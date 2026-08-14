import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const common = await getTranslations("common");

  return (
    <div className="section-pad">
      <div className="container-page max-w-2xl">
        <h1 className="font-display text-4xl font-bold">{t("cart")}</h1>
        <p className="mt-3 text-[var(--muted)]">{common("comingSoon")}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Cart + Stripe checkout (test mode) will be wired in the next phase.
          Georgia production may use TBC ePay / BOG Pay.
        </p>
        <Button asChild className="mt-6">
          <Link href="/parts">← Parts</Link>
        </Button>
      </div>
    </div>
  );
}
