import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ImageGallery } from "@/components/catalog/image-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPartById } from "@/lib/catalog";
import { formatPrice, tText } from "@/lib/utils";
import type { Locale } from "@/types/catalog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const part = await getPartById(id);
  if (!part) return { title: "Not found" };
  const title = tText(part.name, locale as Locale);
  const description = tText(part.description, locale as Locale);
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function PartDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const part = await getPartById(id);
  if (!part) notFound();

  const t = await getTranslations("parts");
  const tCat = await getTranslations("category");
  const tCommon = await getTranslations("common");
  const loc = locale as Locale;
  const title = tText(part.name, loc);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    sku: part.sku,
    mpn: part.oemNumber,
    description: tText(part.description, loc),
    image: part.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      price: part.price,
      priceCurrency: part.currency,
      availability:
        part.stockQty > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="section-pad">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-page">
        <Link
          href="/parts"
          className="text-sm text-[var(--muted)] hover:text-white"
        >
          ← {tCommon("back")}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <ImageGallery images={part.images} title={title} />

          <div>
            <Badge className="bg-white/10 text-white">
              {tCat(part.category as "engine")}
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-3xl font-bold text-[var(--accent)]">
              {formatPrice(part.price, part.currency, loc)}
            </p>
            <p className="mt-4 text-[var(--muted)] leading-relaxed">
              {tText(part.description, loc)}
            </p>

            <dl className="mt-8 space-y-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">{t("sku")}</dt>
                <dd className="font-semibold">{part.sku}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">{t("oem")}</dt>
                <dd className="font-semibold">{part.oemNumber || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">{t("stock")}</dt>
                <dd className="font-semibold">
                  {part.stockQty > 0
                    ? `${t("inStock")} (${part.stockQty})`
                    : t("outOfStock")}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("compatibility")}</dt>
                <dd className="mt-1 font-semibold">
                  {part.compatibleMakes.join(", ")} ·{" "}
                  {part.compatibleModels.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("years")}</dt>
                <dd className="mt-1 font-semibold">
                  {Math.min(...part.compatibleYears)}–
                  {Math.max(...part.compatibleYears)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="flex-1"
                disabled={part.stockQty <= 0}
              >
                <Link href={`/cart?add=${part.id}`}>{t("addToCart")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="flex-1">
                <Link href={`/request-quote?type=part&itemId=${part.id}`}>
                  Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
