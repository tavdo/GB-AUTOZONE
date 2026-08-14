import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice, tText } from "@/lib/utils";
import type { Locale, Part } from "@/types/catalog";

export async function PartCard({
  part,
  locale,
}: {
  part: Part;
  locale: Locale;
}) {
  const t = await getTranslations("parts");
  const tCat = await getTranslations("category");
  const image = part.images[0];

  return (
    <Link
      href={`/parts/${part.id}`}
      className="group block overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition hover:border-[color-mix(in_oklab,var(--accent)_55%,transparent)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-2)]">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || tText(part.name, locale)}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/70 text-white">
            {tCat(part.category as "engine")}
          </Badge>
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {tText(part.name, locale)}
        </h3>
        <p className="text-sm text-[var(--muted)]">
          {part.compatibleMakes.join(", ")}
          {part.oemNumber ? ` · OEM ${part.oemNumber}` : ""}
        </p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-[var(--accent)]">
            {formatPrice(part.price, part.currency, locale)}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {part.stockQty > 0
              ? `${t("inStock")} (${part.stockQty})`
              : t("outOfStock")}
          </p>
        </div>
      </div>
    </Link>
  );
}
