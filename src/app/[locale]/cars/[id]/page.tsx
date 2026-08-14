import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ImageGallery } from "@/components/catalog/image-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCarById } from "@/lib/catalog";
import { formatMileage, formatPrice, tText } from "@/lib/utils";
import type { Locale } from "@/types/catalog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params;
  const car = await getCarById(id);
  if (!car) return { title: "Not found" };
  const title = `${car.year} ${car.make} ${car.model}`;
  const description = tText(car.description, locale as Locale);
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const car = await getCarById(id);
  if (!car) notFound();

  const t = await getTranslations("cars");
  const tStatus = await getTranslations("status");
  const tDamage = await getTranslations("damage");
  const tCommon = await getTranslations("common");
  const loc = locale as Locale;
  const title = `${car.year} ${car.make} ${car.model}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: title,
    vehicleIdentificationNumber: car.vin,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: car.currency,
      availability:
        car.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    image: car.images.map((i) => i.url),
  };

  return (
    <div className="section-pad">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-page">
        <Link
          href="/cars"
          className="text-sm text-[var(--muted)] hover:text-white"
        >
          ← {tCommon("back")}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <ImageGallery images={car.images} title={title} />

          <div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white/10 text-white">
                {tStatus(car.status)}
              </Badge>
              {car.damageType ? (
                <Badge className="bg-[var(--accent)] text-[var(--accent-foreground)]">
                  {tDamage(car.damageType as "front")}
                </Badge>
              ) : null}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-3xl font-bold text-[var(--accent)]">
              {formatPrice(car.price, car.currency, loc)}
            </p>
            <p className="mt-4 text-[var(--muted)] leading-relaxed">
              {tText(car.description, loc)}
            </p>

            <dl className="mt-8 grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">{t("mileage")}</dt>
                <dd className="mt-1 font-semibold">
                  {formatMileage(car.mileage, loc)}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("vin")}</dt>
                <dd className="mt-1 font-semibold">{car.vin || "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("source")}</dt>
                <dd className="mt-1 font-semibold">
                  {car.auctionSource || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("lot")}</dt>
                <dd className="mt-1 font-semibold">
                  {car.auctionLot || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("location")}</dt>
                <dd className="mt-1 font-semibold">{car.location || "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">{t("damage")}</dt>
                <dd className="mt-1 font-semibold">
                  {car.damageType
                    ? tDamage(car.damageType as "front")
                    : "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {car.status === "available" ? (
                <Button asChild size="lg" className="flex-1">
                  <Link href={`/checkout?carId=${car.id}`}>{t("reserve")}</Link>
                </Button>
              ) : (
                <Button size="lg" className="flex-1" disabled>
                  {tStatus(car.status)}
                </Button>
              )}
              <Button asChild size="lg" variant="secondary" className="flex-1">
                <Link href={`/request-quote?type=car&itemId=${car.id}`}>
                  {t("inquire")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
