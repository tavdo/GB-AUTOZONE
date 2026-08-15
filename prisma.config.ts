import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
const useTurso = Boolean(
  tursoUrl &&
    tursoToken &&
    process.env.PRISMA_PUSH_TARGET === "turso",
);

const localUrl =
  process.env.MIGRATE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  `file:${path.join("prisma", "dev.db").replace(/\\/g, "/")}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Always a file URL for the Prisma CLI parser; Turso goes through adapter
    url: localUrl,
  },
  ...(useTurso
    ? {
        experimental: { adapter: true },
        async adapter() {
          return new PrismaLibSql({
            url: tursoUrl!,
            authToken: tursoToken,
          });
        },
      }
    : {}),
});
