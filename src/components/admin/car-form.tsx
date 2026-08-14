"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { damageTypes } from "@/lib/data/cars";
import type { Car, CarStatus, CurrencyCode, I18nText } from "@/types/catalog";

const emptyI18n = (): I18nText => ({ ka: "", en: "", ru: "" });

export function CarForm({
  locale,
  initial,
}: {
  locale: string;
  initial?: Car;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [make, setMake] = useState(initial?.make ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [vin, setVin] = useState(initial?.vin ?? "");
  const [mileage, setMileage] = useState(String(initial?.mileage ?? 0));
  const [price, setPrice] = useState(String(initial?.price ?? 0));
  const [currency, setCurrency] = useState<CurrencyCode>(initial?.currency ?? "USD");
  const [damageType, setDamageType] = useState(initial?.damageType ?? "");
  const [auctionSource, setAuctionSource] = useState(initial?.auctionSource ?? "");
  const [auctionLot, setAuctionLot] = useState(initial?.auctionLot ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [status, setStatus] = useState<CarStatus>(initial?.status ?? "available");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [imageUrl, setImageUrl] = useState(initial?.images?.[0]?.url ?? "");
  const [description, setDescription] = useState<I18nText>(
    initial?.description ?? emptyI18n(),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      make,
      model,
      year: Number(year),
      vin: vin || null,
      mileage: Number(mileage),
      price: Number(price),
      currency,
      damageType: damageType || null,
      auctionSource: auctionSource || null,
      auctionLot: auctionLot || null,
      location: location || null,
      status,
      featured,
      description,
      imageUrl,
      images: imageUrl
        ? [{ id: initial?.images?.[0]?.id || "img-1", url: imageUrl, sortOrder: 0 }]
        : initial?.images ?? [],
    };

    const url = initial
      ? `/api/admin/cars/${initial.id}`
      : "/api/admin/cars";
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

    router.push(`/${locale}/admin/cars`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Make *" value={make} onChange={(e) => setMake(e.target.value)} required />
        <Input placeholder="Model *" value={model} onChange={(e) => setModel(e.target.value)} required />
        <Input placeholder="Year *" type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
        <Input placeholder="VIN" value={vin} onChange={(e) => setVin(e.target.value)} />
        <Input placeholder="Mileage (km)" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
        <Input placeholder="Price *" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="USD">USD</option>
          <option value="GEL">GEL</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CarStatus)}
          className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="available">available</option>
          <option value="reserved">reserved</option>
          <option value="sold">sold</option>
        </select>
        <select
          value={damageType}
          onChange={(e) => setDamageType(e.target.value)}
          className="h-11 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        >
          <option value="">Damage type</option>
          {damageTypes.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <Input placeholder="Auction source" value={auctionSource} onChange={(e) => setAuctionSource(e.target.value)} />
        <Input placeholder="Auction lot" value={auctionLot} onChange={(e) => setAuctionLot(e.target.value)} />
        <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <Input
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured on homepage
      </label>

      {(["ka", "en", "ru"] as const).map((lang) => (
        <textarea
          key={lang}
          rows={3}
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
          {saving ? "Saving…" : initial ? "Update car" : "Create car"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/admin/cars`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
