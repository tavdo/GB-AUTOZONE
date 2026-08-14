import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PartCard } from "@/components/catalog/part-card";
import { PartsFilters } from "@/components/catalog/parts-filters";
import { EmptyState } from "@/components/catalog/empty-state";
import { getPartMakes, getParts } from "@/lib/catalog";
import type { Locale, PartFilters } from "@/types/catalog";

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
    title: t("partsTitle"),
    description: t("partsDescription"),
  };
}

export default async function PartsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("parts");
  const nav = await getTranslations("nav");

  const filters: PartFilters = {
    q: pick(sp.q),
    category: pick(sp.category),
    make: pick(sp.make),
    model: pick(sp.model),
    year: pick(sp.year) ? Number(pick(sp.year)) : undefined,
    oemNumber: pick(sp.oemNumber),
    sort: (pick(sp.sort) as PartFilters["sort"]) || "newest",
    page: pick(sp.page) ? Number(pick(sp.page)) : 1,
  };

  const [result, makes] = await Promise.all([
    getParts(filters),
    getPartMakes(),
  ]);

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
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-lg bg-[var(--surface)]" />
            }
          >
            <PartsFilters makes={makes} />
          </Suspense>

          <div>
            {result.items.length === 0 ? (
              <EmptyState
                title={t("empty")}
                hint={t("emptyHint")}
                actionHref="/request-quote"
                actionLabel={nav("requestQuote")}
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((part) => (
                  <PartCard
                    key={part.id}
                    part={part}
                    locale={locale as Locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
