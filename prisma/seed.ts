/**
 * Seed script — run after DATABASE_URL points to a real Postgres instance:
 *   npx prisma db seed
 *
 * Until then the app uses mock data from src/lib/data/* (USE_MOCK_DATA=true).
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { cars } from "../src/lib/data/cars";
import { parts } from "../src/lib/data/parts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
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
      },
    });
  }

  console.log(`Seeded ${cars.length} cars and ${parts.length} parts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
