"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  type: z.enum(["car", "part", "custom"]),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export function RequestQuoteForm({
  defaultType = "custom",
  itemId,
}: {
  defaultType?: string;
  itemId?: string;
}) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: (["car", "part", "custom"].includes(defaultType)
        ? defaultType
        : "custom") as FormValues["type"],
      message: itemId ? `Item: ${itemId}\n\n` : "",
    },
  });

  async function onSubmit(values: FormValues) {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, itemId: itemId || null }),
    });
    if (!res.ok) return;
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="font-semibold text-[var(--success)]">Request received.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          We will contact you shortly via email or WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <select
        {...register("type")}
        className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
      >
        <option value="car">Car / auction lot</option>
        <option value="part">Part</option>
        <option value="custom">Custom</option>
      </select>
      <Input placeholder="Name" {...register("contactName")} />
      {errors.contactName ? (
        <p className="text-xs text-[var(--danger)]">Name is required</p>
      ) : null}
      <Input placeholder="Email" type="email" {...register("contactEmail")} />
      {errors.contactEmail ? (
        <p className="text-xs text-[var(--danger)]">Valid email required</p>
      ) : null}
      <Input placeholder="Phone / WhatsApp" {...register("contactPhone")} />
      <textarea
        {...register("message")}
        rows={5}
        placeholder="Make, model, year, lot number, OEM…"
        className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
      />
      {errors.message ? (
        <p className="text-xs text-[var(--danger)]">Message too short</p>
      ) : null}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "…" : "Send request"}
      </Button>
    </form>
  );
}
