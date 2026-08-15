import type { MetadataRoute } from "next";
import { listCarsAsync, listPartsAsync } from "@/lib/admin-data";
import { routing } from "@/i18n/routing";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/cars",
    "/parts",
    "/about",
    "/contact",
    "/shipping-info",
    "/request-quote",
  ];

  const [cars, parts] = await Promise.all([
    listCarsAsync().catch(() => []),
    listPartsAsync().catch(() => []),
  ]);

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
