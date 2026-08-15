import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const url =
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    "file:./prisma/dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Remote Turso needs token; local sqlite file does not
  const adapter = new PrismaLibSql(
    url.startsWith("libsql://") || url.startsWith("https://")
      ? { url, authToken }
      : { url },
  );

  return new PrismaClient({ adapter });
}

export function isMockDataEnabled() {
  if (process.env.USE_MOCK_DATA === "true") return true;
  if (process.env.USE_MOCK_DATA === "false") return false;
  // Auto: use DB when Turso URL is set with a token
  return !(
    process.env.TURSO_DATABASE_URL &&
    process.env.TURSO_AUTH_TOKEN
  );
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  (isMockDataEnabled()
    ? (null as unknown as PrismaClient)
    : createPrismaClient());

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

/** Always returns a client (for seed / scripts). */
export function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}
