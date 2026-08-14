import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function ShippingInfoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-4xl font-bold md:text-5xl">
          {t("shipping")}
        </h1>
        <div className="mt-8 space-y-6 text-[color-mix(in_oklab,var(--foreground)_90%,transparent)]">
          <section>
            <h2 className="font-display text-2xl font-semibold">Timeline</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              Typical US auction → Georgia port transit is 4–8 weeks depending on
              lot location, shipping line and customs clearance.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">Methods</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-[var(--muted)]">
              <li>Container shipping (vehicles / bulk parts)</li>
              <li>Roll-on/roll-off where available</li>
              <li>Courier for smaller parts after arrival</li>
            </ul>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">Customs</h2>
            <p className="mt-2 text-[var(--muted)] leading-relaxed">
              We assist with Georgian customs documentation. Final duties depend
              on vehicle age, engine and declared value — ask for a quote before
              bidding.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
