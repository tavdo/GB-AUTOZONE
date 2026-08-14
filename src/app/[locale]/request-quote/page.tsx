import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequestQuoteForm } from "@/components/forms/request-quote-form";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RequestQuotePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const sp = await searchParams;
  const type = (Array.isArray(sp.type) ? sp.type[0] : sp.type) || "custom";
  const itemId = Array.isArray(sp.itemId) ? sp.itemId[0] : sp.itemId;

  return (
    <div className="section-pad">
      <div className="container-page max-w-xl">
        <h1 className="font-display text-4xl font-bold">{t("requestQuote")}</h1>
        <p className="mt-2 text-[var(--muted)]">
          Copart/IAAI lot or rare part — we will calculate and reply.
        </p>
        <div className="mt-8">
          <RequestQuoteForm defaultType={type} itemId={itemId} />
        </div>
      </div>
    </div>
  );
}
