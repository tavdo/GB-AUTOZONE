import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const phone = process.env.NEXT_PUBLIC_PHONE || "+995 XXX XX XX XX";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "995555000000";
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || "gbautozone";

  return (
    <div className="section-pad">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-4xl font-bold md:text-5xl">
          {t("contact")}
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]"
          >
            <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
              Phone
            </p>
            <p className="mt-2 font-semibold">{phone}</p>
          </a>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]"
          >
            <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
              WhatsApp
            </p>
            <p className="mt-2 font-semibold">wa.me/{whatsapp}</p>
          </a>
          <a
            href={`https://t.me/${telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]"
          >
            <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
              Telegram
            </p>
            <p className="mt-2 font-semibold">@{telegram}</p>
          </a>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
              Hours
            </p>
            <p className="mt-2 font-semibold">Mon–Sat · 10:00–19:00</p>
          </div>
        </div>
        <div className="mt-8 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <iframe
            title="Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=44.75%2C41.68%2C44.85%2C41.74&layer=mapnik"
            className="h-72 w-full border-0 grayscale-[30%]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
