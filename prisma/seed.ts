import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Import seed data using relative path (tsx doesn't resolve tsconfig paths)
import { seedJobs } from "../src/lib/data/jobs.seed";

function createClient(): PrismaClient {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    console.log("Using Turso database...");
    const adapter = new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  console.log("Using local SQLite database...");
  return new PrismaClient();
}

const prisma = createClient();

async function main() {
  console.log("Seeding database...");

  let created = 0;
  let skipped = 0;

  for (const job of seedJobs) {
    const existing = await prisma.job.findUnique({ where: { id: job.id } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.job.create({
      data: {
        id: job.id,
        title: job.title,
        company: job.company,
        locationZone: job.locationZone,
        workMode: job.workMode,
        minExp: job.minExp,
        maxExp: job.maxExp,
        salaryMinLPA: job.salaryMinLPA,
        salaryMaxLPA: job.salaryMaxLPA,
        stackTags: JSON.stringify(job.stackTags),
        jdText: job.jdText,
        sourceType: job.sourceType,
        postedAt: new Date(job.postedAt),
        repostCount: job.repostCount,
        verified: job.verified,
        reports: job.reports,
        companyLogo: job.companyLogo ?? null,
        applyUrl: job.applyUrl ?? null,
        source: "seed",
      },
    });
    created++;
  }

  console.log(`Jobs: ${created} created, ${skipped} skipped (already exist).`);

  const defaultPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const hash = await bcrypt.hash(defaultPassword, 10);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: { passwordHash: hash },
    create: {
      username: "admin",
      passwordHash: hash,
    },
  });

  console.log("Admin user created (username: admin).");
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
