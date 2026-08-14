import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const common = await getTranslations("common");

  return (
    <div className="section-pad">
      <div className="container-page max-w-2xl">
        <h1 className="font-display text-4xl font-bold">Checkout</h1>
        <p className="mt-3 text-[var(--muted)]">{common("comingSoon")}</p>
        <Button asChild className="mt-6">
          <Link href="/cars">← Cars</Link>
        </Button>
      </div>
    </div>
  );
}
