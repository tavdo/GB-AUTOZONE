"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogImage } from "@/types/catalog";

export function ImageGallery({
  images,
  title,
}: {
  images: CatalogImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const current = images[active] ?? images[0];

  if (!current) {
    return (
      <div className="aspect-[16/10] rounded-lg bg-[var(--surface)]" />
    );
  }

  return (
    <>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[var(--surface)]"
        >
          <Image
            src={current.url}
            alt={current.alt || title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
        </button>
        {images.length > 1 ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActive(idx)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md border",
                  idx === active
                    ? "border-[var(--accent)]"
                    : "border-[var(--border)]",
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${title} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightbox ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 rounded-md border border-white/20 p-2 text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl">
            <Image
              src={current.url}
              alt={current.alt || title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
