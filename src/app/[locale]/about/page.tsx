import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const meta = await getTranslations("meta");

  return (
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-4xl font-bold md:text-5xl">
          {t("about")}
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
          {meta("tagline")}
        </p>
        <div className="mt-8 space-y-4 text-[color-mix(in_oklab,var(--foreground)_90%,transparent)] leading-relaxed">
          <p>
            GB Autozone imports American vehicles from auction sources (Copart,
            IAAI and private sellers) and stocks OEM / used parts for repair and
            rebuild projects across Georgia and the region.
          </p>
          <p>
            Every listing aims for transparency: damage type, lot numbers, VIN
            where available, and real photos — so buyers can decide with clear
            information.
          </p>
        </div>
      </div>
    </div>
  );
}
