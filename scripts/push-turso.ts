/**
 * Apply prisma/turso-schema.sql to remote Turso.
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const sqlPath = path.join(process.cwd(), "prisma", "turso-schema.sql");

function toStatements(sql: string): string[] {
  // Drop line comments, keep SQL
  const withoutComments = sql
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  return withoutComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main() {
  if (!existsSync(sqlPath)) {
    console.error(`Missing ${sqlPath}`);
    process.exit(1);
  }

  const sql = readFileSync(sqlPath, "utf8");
  const statements = toStatements(sql);
  const client = createClient({ url, authToken });

  console.log(`Applying ${statements.length} statements to Turso...`);
  for (const statement of statements) {
    try {
      await client.execute(statement);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Ignore "already exists" so re-runs are safe
      if (/already exists/i.test(msg)) {
        console.warn("skip:", msg);
        continue;
      }
      console.error("Failed on:\n", statement.slice(0, 200));
      throw e;
    }
  }
  console.log("Turso schema applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
