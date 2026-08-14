"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteButton } from "@/components/admin/delete-button";
import type { Order, OrderStatus } from "@/types/catalog";

const statuses: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "customs",
  "delivered",
  "cancelled",
];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function updateStatus(id: string, status: OrderStatus) {
    setBusy(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBusy(null);
    router.refresh();
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted)]">
        No orders yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-[var(--surface)] text-[var(--muted)]">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-[var(--border)]">
              <td className="px-4 py-3">
                <p className="font-semibold">{order.id}</p>
                <p className="text-xs text-[var(--muted)]">
                  {order.items.map((i) => i.title).join(", ")}
                </p>
              </td>
              <td className="px-4 py-3">
                <p>{order.customerName || "—"}</p>
                <p className="text-xs text-[var(--muted)]">
                  {order.customerEmail}
                </p>
              </td>
              <td className="px-4 py-3">
                {order.totalAmount} {order.currency}
              </td>
              <td className="px-4 py-3">
                <select
                  value={order.status}
                  disabled={busy === order.id}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value as OrderStatus)
                  }
                  className="h-9 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <DeleteButton endpoint={`/api/admin/orders?id=${order.id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
