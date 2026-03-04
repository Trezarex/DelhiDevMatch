/**
 * Push schema to Turso and seed the database.
 *
 * Usage:
 *   1. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env
 *   2. Run: npm run db:setup:turso
 */
import { createClient } from "@libsql/client";
import "dotenv/config";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Error: Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env first.");
  console.error("See .env.example for details.");
  process.exit(1);
}

const client = createClient({ url, authToken });

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "Job" (
  "id"           TEXT PRIMARY KEY NOT NULL,
  "title"        TEXT NOT NULL,
  "company"      TEXT NOT NULL,
  "locationZone" TEXT NOT NULL,
  "workMode"     TEXT NOT NULL,
  "minExp"       INTEGER NOT NULL,
  "maxExp"       INTEGER NOT NULL,
  "salaryMinLPA" REAL NOT NULL,
  "salaryMaxLPA" REAL NOT NULL,
  "stackTags"    TEXT NOT NULL,
  "jdText"       TEXT NOT NULL,
  "sourceType"   TEXT NOT NULL,
  "postedAt"     DATETIME NOT NULL,
  "repostCount"  INTEGER NOT NULL DEFAULT 0,
  "verified"     INTEGER NOT NULL DEFAULT 0,
  "reports"      INTEGER NOT NULL DEFAULT 0,
  "companyLogo"  TEXT,
  "applyUrl"     TEXT,
  "adzunaId"     TEXT UNIQUE,
  "source"       TEXT NOT NULL DEFAULT 'seed',
  "isActive"     INTEGER NOT NULL DEFAULT 1,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "Job_locationZone_idx" ON "Job"("locationZone");
CREATE INDEX IF NOT EXISTS "Job_sourceType_idx" ON "Job"("sourceType");
CREATE INDEX IF NOT EXISTS "Job_postedAt_idx" ON "Job"("postedAt");
CREATE INDEX IF NOT EXISTS "Job_isActive_idx" ON "Job"("isActive");

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id"           TEXT PRIMARY KEY NOT NULL,
  "username"     TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "createdAt"    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RefreshLog" (
  "id"          TEXT PRIMARY KEY NOT NULL,
  "startedAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" DATETIME,
  "jobsFetched" INTEGER NOT NULL DEFAULT 0,
  "jobsAdded"   INTEGER NOT NULL DEFAULT 0,
  "jobsSkipped" INTEGER NOT NULL DEFAULT 0,
  "error"       TEXT,
  "status"      TEXT NOT NULL DEFAULT 'running'
);
`;

async function main() {
  console.log("Pushing schema to Turso...");
  console.log(`Database: ${url}`);

  // Execute each statement separately
  const statements = SCHEMA_SQL
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sql of statements) {
    await client.execute(sql);
  }

  console.log("Schema created successfully!");
  console.log("");
  console.log("Next step: seed the database with:");
  console.log("  npm run db:seed");
  console.log("");
  console.log("(The seed script will auto-detect Turso env vars)");
}

main()
  .catch((e) => {
    console.error("Failed:", e);
    process.exit(1);
  })
  .finally(() => client.close());
