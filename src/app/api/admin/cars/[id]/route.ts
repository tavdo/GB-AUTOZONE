import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { deleteCarAsync, getCarAsync, updateCarAsync } from "@/lib/admin-data";
import { createId } from "@/lib/store";
import type { CarInput } from "@/types/catalog";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const car = await getCarAsync(id);
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(request: Request, ctx: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await request.json()) as Partial<CarInput> & {
    imageUrl?: string;
  };

  const patch: Partial<CarInput> = { ...body };
  if (body.imageUrl) {
    patch.images = [
      {
        id: createId("img"),
        url: body.imageUrl,
        sortOrder: 0,
      },
    ];
  }
  if (body.year != null) patch.year = Number(body.year);
  if (body.price != null) patch.price = Number(body.price);
  if (body.mileage != null) patch.mileage = Number(body.mileage);
  if (body.featured != null) patch.featured = Boolean(body.featured);

  const car = await updateCarAsync(id, patch);
  if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const ok = await deleteCarAsync(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
