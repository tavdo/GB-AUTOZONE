import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import {
  deleteOrderAsync,
  listOrdersAsync,
  updateOrderStatusAsync,
} from "@/lib/admin-data";
import type { OrderStatus } from "@/types/catalog";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await listOrdersAsync());
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { id?: string; status?: OrderStatus };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  const order = await updateOrderStatusAsync(body.id, body.status);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const ok = await deleteOrderAsync(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
