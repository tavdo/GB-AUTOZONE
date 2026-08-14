import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CarCard } from "@/components/catalog/car-card";
import { CarsFilters } from "@/components/catalog/cars-filters";
import { EmptyState } from "@/components/catalog/empty-state";
import { getCarMakes, getCars } from "@/lib/catalog";
import type { CarFilters, Locale } from "@/types/catalog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pick(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("carsTitle"),
    description: t("carsDescription"),
  };
}

export default async function CarsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("cars");
  const nav = await getTranslations("nav");

  const filters: CarFilters = {
    q: pick(sp.q),
    make: pick(sp.make),
    model: pick(sp.model),
    yearMin: pick(sp.yearMin) ? Number(pick(sp.yearMin)) : undefined,
    yearMax: pick(sp.yearMax) ? Number(pick(sp.yearMax)) : undefined,
    priceMin: pick(sp.priceMin) ? Number(pick(sp.priceMin)) : undefined,
    priceMax: pick(sp.priceMax) ? Number(pick(sp.priceMax)) : undefined,
    mileageMax: pick(sp.mileageMax) ? Number(pick(sp.mileageMax)) : undefined,
    damageType: pick(sp.damageType),
    sort: (pick(sp.sort) as CarFilters["sort"]) || "newest",
    page: pick(sp.page) ? Number(pick(sp.page)) : 1,
  };

  const [result, makes] = await Promise.all([getCars(filters), getCarMakes()]);

  return (
    <div className="section-pad">
      <div className="container-page">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-[var(--muted)]">{t("subtitle")}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-[var(--surface)]" />}>
            <CarsFilters makes={makes} />
          </Suspense>

          <div>
            <p className="mb-4 text-sm text-[var(--muted)]">
              {t("results", { count: result.total })}
            </p>
            {result.items.length === 0 ? (
              <EmptyState
                title={t("empty")}
                hint={t("emptyHint")}
                actionHref="/request-quote"
                actionLabel={nav("requestQuote")}
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    locale={locale as Locale}
                  />
                ))}
              </div>
            )}

            {result.totalPages > 1 ? (
              <div className="mt-8 flex items-center justify-between text-sm">
                <p className="text-[var(--muted)]">
                  {t("page", { page: result.page, total: result.totalPages })}
                </p>
                <div className="flex gap-2">
                  {result.page > 1 ? (
                    <Link
                      href={`/cars?${new URLSearchParams({ ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "") as [string, string][]), page: String(result.page - 1) }).toString()}`}
                      className="rounded-md border border-[var(--border)] px-3 py-2 hover:bg-white/5"
                    >
                      ←
                    </Link>
                  ) : null}
                  {result.page < result.totalPages ? (
                    <Link
                      href={`/cars?${new URLSearchParams({ ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v != null && v !== "") as [string, string][]), page: String(result.page + 1) }).toString()}`}
                      className="rounded-md border border-[var(--border)] px-3 py-2 hover:bg-white/5"
                    >
                      →
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
