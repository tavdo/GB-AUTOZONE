import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

/** Use only when USE_MOCK_DATA is not "true" and DATABASE_URL is configured. */
export const prisma =
  globalForPrisma.prisma ??
  (process.env.USE_MOCK_DATA === "true" || !process.env.DATABASE_URL
    ? (null as unknown as PrismaClient)
    : createPrismaClient());

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export function isMockDataEnabled() {
  return (
    process.env.USE_MOCK_DATA === "true" ||
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("localhost:51213")
  );
}
