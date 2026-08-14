"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Inquiry, InquiryStatus } from "@/types/catalog";

const statuses: InquiryStatus[] = ["new", "in_progress", "quoted", "closed"];

export function InquiriesTable({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function updateStatus(id: string, status: InquiryStatus) {
    setBusy(id);
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBusy(null);
    router.refresh();
  }

  if (inquiries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted)]">
        No inquiries yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inq) => (
        <div
          key={inq.id}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold">
                {inq.contactName}{" "}
                <span className="text-xs font-normal text-[var(--muted)]">
                  · {inq.type}
                </span>
              </p>
              <p className="text-sm text-[var(--muted)]">
                {inq.contactEmail}
                {inq.contactPhone ? ` · ${inq.contactPhone}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={inq.status}
                disabled={busy === inq.id}
                onChange={(e) =>
                  updateStatus(inq.id, e.target.value as InquiryStatus)
                }
                className="h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <DeleteButton endpoint={`/api/admin/inquiries?id=${inq.id}`} />
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
            {inq.message}
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {new Date(inq.createdAt).toLocaleString()}
            {inq.itemId ? ` · item: ${inq.itemId}` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
