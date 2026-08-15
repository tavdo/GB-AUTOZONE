/**
 * Seed Turso / local SQLite:
 *   npx tsx prisma/seed.ts
 *
 * Requires TURSO_DATABASE_URL + TURSO_AUTH_TOKEN (or local DATABASE_URL=file:./prisma/dev.db)
 */
import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import { cars } from "../src/lib/data/cars";
import { parts } from "../src/lib/data/parts";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "file:./prisma/dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql(
  url.startsWith("libsql://") || url.startsWith("https://")
    ? { url, authToken }
    : { url },
);
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const car of cars) {
    await prisma.car.upsert({
      where: { id: car.id },
      create: {
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        vin: car.vin,
        mileage: car.mileage,
        price: car.price,
        currency: car.currency,
        damageType: car.damageType,
        auctionSource: car.auctionSource,
        auctionLot: car.auctionLot,
        location: car.location,
        description: car.description,
        status: car.status,
        featured: car.featured ?? false,
        images: {
          create: car.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
            ownerType: "car",
          })),
        },
      },
      update: {
        price: car.price,
        status: car.status,
        featured: car.featured ?? false,
        description: car.description,
      },
    });
  }

  for (const part of parts) {
    await prisma.part.upsert({
      where: { id: part.id },
      create: {
        id: part.id,
        sku: part.sku,
        name: part.name,
        category: part.category,
        compatibleMakes: part.compatibleMakes,
        compatibleModels: part.compatibleModels,
        compatibleYears: part.compatibleYears,
        oemNumber: part.oemNumber,
        price: part.price,
        currency: part.currency,
        stockQty: part.stockQty,
        description: part.description,
        featured: part.featured ?? false,
        images: {
          create: part.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
            ownerType: "part",
          })),
        },
      },
      update: {
        price: part.price,
        stockQty: part.stockQty,
        featured: part.featured ?? false,
        name: part.name,
        description: part.description,
        compatibleMakes: part.compatibleMakes,
        compatibleModels: part.compatibleModels,
        compatibleYears: part.compatibleYears,
      },
    });
  }

  console.log(`Seeded ${cars.length} cars and ${parts.length} parts → ${url}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
