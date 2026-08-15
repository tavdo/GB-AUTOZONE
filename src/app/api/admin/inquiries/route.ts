import { NextResponse } from "next/server";
import { requireAdmin } from "@/auth";
import {
  deleteInquiryAsync,
  listInquiriesAsync,
  updateInquiryStatusAsync,
} from "@/lib/admin-data";
import type { InquiryStatus } from "@/types/catalog";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await listInquiriesAsync());
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { id?: string; status?: InquiryStatus };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  const inquiry = await updateInquiryStatusAsync(body.id, body.status);
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(inquiry);
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
  const ok = await deleteInquiryAsync(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
