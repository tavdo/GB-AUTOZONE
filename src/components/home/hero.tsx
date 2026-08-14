import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function Hero() {
  const t = await getTranslations("home");
  const meta = await getTranslations("meta");

  return (
    <section className="relative min-h-[min(92vh,820px)] overflow-hidden">
      {/* Same asset as site bg — full-bleed hero plane */}
      <Image
        src="/images/site-bg.png"
        alt="GB Autozone — American sports car"
        fill
        priority
        className="hero-kenburns object-cover object-[center_40%]"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay)" }}
      />

      <div className="container-page relative flex min-h-[min(92vh,820px)] flex-col justify-end pb-16 pt-28 md:justify-center md:pb-24 md:pt-20">
        <p className="fade-up font-display text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          GB<span className="text-[var(--accent)]">Autozone</span>
        </p>
        <p className="fade-up-delay mt-2 text-sm font-medium tracking-[0.18em] text-[var(--muted)] uppercase">
          {meta("tagline")}
        </p>
        <h1 className="fade-up-delay mt-6 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          {t("heroHeadline")}
        </h1>
        <p className="fade-up-delay-2 mt-4 max-w-xl text-base leading-relaxed text-[color-mix(in_oklab,var(--foreground)_88%,transparent)] sm:text-lg">
          {t("heroSub")}
        </p>
        <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/cars">{t("ctaCars")}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/parts">{t("ctaParts")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
