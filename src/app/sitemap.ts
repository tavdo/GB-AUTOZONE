import type { MetadataRoute } from "next";
import { cars } from "@/lib/data/cars";
import { parts } from "@/lib/data/parts";
import { routing } from "@/i18n/routing";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/cars",
    "/parts",
    "/about",
    "/contact",
    "/shipping-info",
    "/request-quote",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${site}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const car of cars) {
      entries.push({
        url: `${site}/${locale}/cars/${car.id}`,
        lastModified: new Date(car.createdAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const part of parts) {
      entries.push({
        url: `${site}/${locale}/parts/${part.id}`,
        lastModified: new Date(part.createdAt),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
