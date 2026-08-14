import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck, PackageSearch, Headphones } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/home/hero";
import { CarCard } from "@/components/catalog/car-card";
import { PartCard } from "@/components/catalog/part-card";
import { Button } from "@/components/ui/button";
import { getFeaturedCars, getFeaturedParts } from "@/lib/catalog";
import type { Locale } from "@/types/catalog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      locale,
      siteName: "GB Autozone",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const cars = await getFeaturedCars(4);
  const parts = await getFeaturedParts(4);

  return (
    <>
      <Hero />

      <section className="section-pad">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              {t("directionsTitle")}
            </h2>
            <p className="mt-2 text-[var(--muted)]">{t("directionsSub")}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              href="/cars"
              className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 transition hover:border-[color-mix(in_oklab,var(--accent)_50%,transparent)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(500px_200px_at_100%_0%,rgba(232,93,4,0.16),transparent)]" />
              <div className="relative">
                <h3 className="font-display text-2xl font-bold">
                  {t("carsCardTitle")}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                  {t("carsCardText")}
                </p>
                <span className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] group-hover:underline">
                  {t("ctaCars")} →
                </span>
              </div>
            </Link>
            <Link
              href="/parts"
              className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-8 transition hover:border-[color-mix(in_oklab,var(--accent)_50%,transparent)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(500px_200px_at_0%_0%,rgba(42,120,200,0.16),transparent)]" />
              <div className="relative">
                <h3 className="font-display text-2xl font-bold">
                  {t("partsCardTitle")}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                  {t("partsCardText")}
                </p>
                <span className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] group-hover:underline">
                  {t("ctaParts")} →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)]">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              {t("latestCars")}
            </h2>
            <Button asChild variant="ghost">
              <Link href="/cars">{t("viewAll")}</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} locale={locale as Locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              {t("latestParts")}
            </h2>
            <Button asChild variant="ghost">
              <Link href="/parts">{t("viewAll")}</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {parts.map((part) => (
              <PartCard key={part.id} part={part} locale={locale as Locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            {t("trustTitle")}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: t("trust1Title"),
                text: t("trust1Text"),
              },
              {
                icon: PackageSearch,
                title: t("trust2Title"),
                text: t("trust2Text"),
              },
              {
                icon: Headphones,
                title: t("trust3Title"),
                text: t("trust3Text"),
              },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-[var(--accent)] pl-4">
                <item.icon className="mb-3 h-6 w-6 text-[var(--accent)]" />
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
