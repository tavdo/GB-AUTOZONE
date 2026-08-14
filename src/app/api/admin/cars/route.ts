import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { createCar, listCars } from "@/lib/admin-data";
import { createId } from "@/lib/store";
import type { CarInput, I18nText } from "@/types/catalog";

function emptyI18n(): I18nText {
  return { ka: "", en: "", ru: "" };
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(listCars());
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<CarInput>;
  if (!body.make || !body.model || !body.year || body.price == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const imageUrls = Array.isArray(body.images)
    ? body.images
    : typeof (body as { imageUrl?: string }).imageUrl === "string"
      ? [
          {
            id: createId("img"),
            url: (body as { imageUrl: string }).imageUrl,
            sortOrder: 0,
          },
        ]
      : [];

  const car = createCar({
    make: body.make,
    model: body.model,
    year: Number(body.year),
    vin: body.vin || null,
    mileage: Number(body.mileage ?? 0),
    price: Number(body.price),
    currency: body.currency === "GEL" ? "GEL" : "USD",
    damageType: body.damageType || null,
    auctionSource: body.auctionSource || null,
    auctionLot: body.auctionLot || null,
    location: body.location || null,
    description: body.description || emptyI18n(),
    status: body.status || "available",
    featured: Boolean(body.featured),
    images: imageUrls.map((img, i) => ({
      id: img.id || createId("img"),
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder ?? i,
    })),
  });

  return NextResponse.json(car, { status: 201 });
}
