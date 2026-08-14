import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatMileage, formatPrice } from "@/lib/utils";
import type { Car, Locale } from "@/types/catalog";

export async function CarCard({
  car,
  locale,
}: {
  car: Car;
  locale: Locale;
}) {
  const tStatus = await getTranslations("status");
  const tDamage = await getTranslations("damage");
  const image = car.images[0];

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group block overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] transition hover:border-[color-mix(in_oklab,var(--accent)_55%,transparent)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-2)]">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || `${car.make} ${car.model}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-black/70 text-white">
            {tStatus(car.status)}
          </Badge>
          {car.damageType ? (
            <Badge className="bg-[var(--accent)] text-[var(--accent-foreground)]">
              {tDamage(car.damageType as "front")}
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="font-display text-xl font-semibold tracking-tight">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="text-sm text-[var(--muted)]">
          {formatMileage(car.mileage, locale)}
          {car.location ? ` · ${car.location}` : ""}
        </p>
        <p className="text-lg font-bold text-[var(--accent)]">
          {formatPrice(car.price, car.currency, locale)}
        </p>
      </div>
    </Link>
  );
}
