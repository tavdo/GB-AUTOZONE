"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  endpoint,
  label = "Delete",
}: {
  endpoint: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm("Delete permanently?")) return;
    setLoading(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Delete failed");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onDelete}
      disabled={loading}
      className="border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger)]/10"
    >
      {loading ? "…" : label}
    </Button>
  );
}
