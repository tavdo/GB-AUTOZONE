import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Local migrate/push target (SQLite file). Runtime uses Turso via adapter in app code.
const url =
  process.env.MIGRATE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  `file:${path.join("prisma", "dev.db").replace(/\\/g, "/")}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
