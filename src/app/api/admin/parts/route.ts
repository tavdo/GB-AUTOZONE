import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { createPartAsync, listPartsAsync } from "@/lib/admin-data";
import { createId } from "@/lib/store";
import type { I18nText, PartInput } from "@/types/catalog";

function emptyI18n(): I18nText {
  return { ka: "", en: "", ru: "" };
}

function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function toYears(value: unknown): number[] {
  if (Array.isArray(value)) return value.map(Number).filter((n) => !Number.isNaN(n));
  if (typeof value === "string") {
    return value
      .split(/[,\-\s]+/)
      .map(Number)
      .filter((n) => !Number.isNaN(n));
  }
  return [];
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await listPartsAsync());
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<PartInput> & {
    imageUrl?: string;
    compatibleMakesText?: string;
    compatibleModelsText?: string;
    compatibleYearsText?: string;
  };

  if (!body.sku || !body.category || body.price == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const images = body.images?.length
    ? body.images
    : body.imageUrl
      ? [{ id: createId("img"), url: body.imageUrl, sortOrder: 0 }]
      : [];

  const part = await createPartAsync({
    sku: body.sku,
    name: body.name || emptyI18n(),
    category: body.category,
    compatibleMakes: toList(body.compatibleMakes ?? body.compatibleMakesText),
    compatibleModels: toList(body.compatibleModels ?? body.compatibleModelsText),
    compatibleYears: toYears(body.compatibleYears ?? body.compatibleYearsText),
    oemNumber: body.oemNumber || null,
    price: Number(body.price),
    currency: body.currency === "GEL" ? "GEL" : "USD",
    stockQty: Number(body.stockQty ?? 0),
    description: body.description || emptyI18n(),
    featured: Boolean(body.featured),
    images: images.map((img, i) => ({
      id: img.id || createId("img"),
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder ?? i,
    })),
  });

  return NextResponse.json(part, { status: 201 });
}
