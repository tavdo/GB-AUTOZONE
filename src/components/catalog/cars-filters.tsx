"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { damageTypes } from "@/lib/data/cars";

export function CarsFilters({ makes }: { makes: string[] }) {
  const t = useTranslations("cars");
  const tDamage = useTranslations("damage");
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of fd.entries()) {
      const v = String(value).trim();
      if (v) params.set(key, v);
    }
    router.push(`/cars?${params.toString()}`);
  }

  function reset() {
    router.push("/cars");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        {t("filters")}
      </p>
      <Input
        name="q"
        placeholder={t("search")}
        defaultValue={searchParams.get("q") ?? ""}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <select
          name="make"
          defaultValue={searchParams.get("make") ?? ""}
          className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="">{t("make")} — {t("all")}</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
        <Input
          name="model"
          placeholder={t("model")}
          defaultValue={searchParams.get("model") ?? ""}
        />
        <Input
          name="yearMin"
          type="number"
          placeholder={`${t("year")} min`}
          defaultValue={searchParams.get("yearMin") ?? ""}
        />
        <Input
          name="yearMax"
          type="number"
          placeholder={`${t("year")} max`}
          defaultValue={searchParams.get("yearMax") ?? ""}
        />
        <Input
          name="priceMin"
          type="number"
          placeholder={`${t("price")} min`}
          defaultValue={searchParams.get("priceMin") ?? ""}
        />
        <Input
          name="priceMax"
          type="number"
          placeholder={`${t("price")} max`}
          defaultValue={searchParams.get("priceMax") ?? ""}
        />
        <Input
          name="mileageMax"
          type="number"
          placeholder={`${t("mileage")} max`}
          defaultValue={searchParams.get("mileageMax") ?? ""}
        />
        <select
          name="damageType"
          defaultValue={searchParams.get("damageType") ?? ""}
          className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="">{t("damage")} — {t("all")}</option>
          {damageTypes.map((d) => (
            <option key={d} value={d}>
              {tDamage(d)}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={searchParams.get("sort") ?? "newest"}
          className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="price_asc">{t("sortPriceAsc")}</option>
          <option value="price_desc">{t("sortPriceDesc")}</option>
          <option value="year_desc">{t("sortYear")}</option>
          <option value="mileage_asc">{t("sortMileage")}</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {t("apply")}
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          {t("reset")}
        </Button>
      </div>
    </form>
  );
}
