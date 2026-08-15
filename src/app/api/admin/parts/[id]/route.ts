import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import { deletePartAsync, getPartAsync, updatePartAsync } from "@/lib/admin-data";
import { createId } from "@/lib/store";
import type { PartInput } from "@/types/catalog";

type Ctx = { params: Promise<{ id: string }> };

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

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const part = await getPartAsync(id);
  if (!part) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(part);
}

export async function PUT(request: Request, ctx: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await request.json()) as Partial<PartInput> & {
    imageUrl?: string;
    compatibleMakesText?: string;
    compatibleModelsText?: string;
    compatibleYearsText?: string;
  };

  const patch: Partial<PartInput> = { ...body };
  if (body.compatibleMakesText != null) {
    patch.compatibleMakes = toList(body.compatibleMakesText);
  }
  if (body.compatibleModelsText != null) {
    patch.compatibleModels = toList(body.compatibleModelsText);
  }
  if (body.compatibleYearsText != null) {
    patch.compatibleYears = toYears(body.compatibleYearsText);
  }
  if (body.imageUrl) {
    patch.images = [{ id: createId("img"), url: body.imageUrl, sortOrder: 0 }];
  }
  if (body.price != null) patch.price = Number(body.price);
  if (body.stockQty != null) patch.stockQty = Number(body.stockQty);
  if (body.featured != null) patch.featured = Boolean(body.featured);

  const part = await updatePartAsync(id, patch);
  if (!part) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(part);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const ok = await deletePartAsync(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
