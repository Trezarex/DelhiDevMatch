import "dotenv/config";
import path from "path";
import { pathToFileURL } from "url";

const rootDir = path.resolve(__dirname, "..");

async function main() {
  const prismaPath = pathToFileURL(
    path.join(rootDir, "src", "generated", "prisma", "client.ts")
  ).href;
  const seedPath = pathToFileURL(
    path.join(rootDir, "src", "lib", "data", "jobs.seed.ts")
  ).href;

  const { PrismaClient } = await import(prismaPath);
  const { seedJobs } = await import(seedPath);
  const bcrypt = await import("bcryptjs");

  const prisma = new PrismaClient();

  try {
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
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
