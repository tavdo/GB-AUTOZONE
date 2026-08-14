"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { partCategories } from "@/lib/data/parts";

export function PartsFilters({ makes }: { makes: string[] }) {
  const t = useTranslations("parts");
  const tCars = useTranslations("cars");
  const tCat = useTranslations("category");
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
    router.push(`/parts?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
    >
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        {tCars("filters")}
      </p>
      <Input
        name="q"
        placeholder={tCars("search")}
        defaultValue={searchParams.get("q") ?? ""}
      />
      <select
        name="category"
        defaultValue={searchParams.get("category") ?? ""}
        className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
      >
        <option value="">
          {t("category")} — {tCars("all")}
        </option>
        {partCategories.map((c) => (
          <option key={c} value={c}>
            {tCat(c)}
          </option>
        ))}
      </select>
      <select
        name="make"
        defaultValue={searchParams.get("make") ?? ""}
        className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
      >
        <option value="">
          {tCars("make")} — {tCars("all")}
        </option>
        {makes.map((make) => (
          <option key={make} value={make}>
            {make}
          </option>
        ))}
      </select>
      <Input
        name="model"
        placeholder={tCars("model")}
        defaultValue={searchParams.get("model") ?? ""}
      />
      <Input
        name="year"
        type="number"
        placeholder={tCars("year")}
        defaultValue={searchParams.get("year") ?? ""}
      />
      <Input
        name="oemNumber"
        placeholder={t("oem")}
        defaultValue={searchParams.get("oemNumber") ?? ""}
      />
      <select
        name="sort"
        defaultValue={searchParams.get("sort") ?? "newest"}
        className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
      >
        <option value="newest">{tCars("sortNewest")}</option>
        <option value="price_asc">{tCars("sortPriceAsc")}</option>
        <option value="price_desc">{tCars("sortPriceDesc")}</option>
      </select>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {tCars("apply")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/parts")}
        >
          {tCars("reset")}
        </Button>
      </div>
    </form>
  );
}
