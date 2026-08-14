"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { partCategories } from "@/lib/data/parts";
import type { CurrencyCode, I18nText, Part } from "@/types/catalog";

const emptyI18n = (): I18nText => ({ ka: "", en: "", ru: "" });

export function PartForm({
  locale,
  initial,
}: {
  locale: string;
  initial?: Part;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [sku, setSku] = useState(initial?.sku ?? "");
  const [category, setCategory] = useState(initial?.category ?? "engine");
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [currency, setCurrency] = useState<CurrencyCode>(initial?.currency ?? "USD");
  const [stockQty, setStockQty] = useState(String(initial?.stockQty ?? 0));
  const [oemNumber, setOemNumber] = useState(initial?.oemNumber ?? "");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [imageUrl, setImageUrl] = useState(initial?.images?.[0]?.url ?? "");
  const [makes, setMakes] = useState(initial?.compatibleMakes.join(", ") ?? "");
  const [models, setModels] = useState(initial?.compatibleModels.join(", ") ?? "");
  const [years, setYears] = useState(initial?.compatibleYears.join(", ") ?? "");
  const [name, setName] = useState<I18nText>(initial?.name ?? emptyI18n());
  const [description, setDescription] = useState<I18nText>(
    initial?.description ?? emptyI18n(),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      sku,
      category,
      price: Number(price),
      currency,
      stockQty: Number(stockQty),
      oemNumber: oemNumber || null,
      featured,
      name,
      description,
      imageUrl,
      compatibleMakesText: makes,
      compatibleModelsText: models,
      compatibleYearsText: years,
      images: imageUrl
        ? [{ id: initial?.images?.[0]?.id || "img-1", url: imageUrl, sortOrder: 0 }]
        : initial?.images ?? [],
    };

    const url = initial
      ? `/api/admin/parts/${initial.id}`
      : "/api/admin/parts";
    const method = initial ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }

    router.push(`/${locale}/admin/parts`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="SKU *" value={sku} onChange={(e) => setSku(e.target.value)} required />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          {partCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Input placeholder="Price *" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="USD">USD</option>
          <option value="GEL">GEL</option>
        </select>
        <Input placeholder="Stock qty" type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} />
        <Input placeholder="OEM number" value={oemNumber} onChange={(e) => setOemNumber(e.target.value)} />
        <Input placeholder="Compatible makes (comma)" value={makes} onChange={(e) => setMakes(e.target.value)} />
        <Input placeholder="Compatible models (comma)" value={models} onChange={(e) => setModels(e.target.value)} />
        <Input placeholder="Years (e.g. 2018, 2019, 2020)" value={years} onChange={(e) => setYears(e.target.value)} className="sm:col-span-2" />
      </div>

      <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Featured on homepage
      </label>

      {(["ka", "en", "ru"] as const).map((lang) => (
        <Input
          key={`name-${lang}`}
          placeholder={`Name (${lang})`}
          value={name[lang]}
          onChange={(e) => setName((n) => ({ ...n, [lang]: e.target.value }))}
        />
      ))}

      {(["ka", "en", "ru"] as const).map((lang) => (
        <textarea
          key={`desc-${lang}`}
          rows={2}
          placeholder={`Description (${lang})`}
          value={description[lang]}
          onChange={(e) =>
            setDescription((d) => ({ ...d, [lang]: e.target.value }))
          }
          className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
      ))}

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Update part" : "Create part"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/admin/parts`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
