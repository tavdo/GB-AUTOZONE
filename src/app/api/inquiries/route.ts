import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/admin-data";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.contactName || !body.contactEmail || !body.message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const inquiry = createInquiry({
    type: body.type || "custom",
    contactName: body.contactName,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone || null,
    message: body.message,
    itemId: body.itemId || null,
  });
  return NextResponse.json(inquiry, { status: 201 });
}
