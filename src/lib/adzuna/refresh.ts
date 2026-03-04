import { prisma } from "@/lib/db/prisma";
import { fetchAdzunaJobs } from "./client";
import { mapAdzunaJob } from "./mapper";

export interface RefreshResult {
  jobsFetched: number;
  jobsAdded: number;
  jobsSkipped: number;
  error?: string;
}

export async function refreshFromAdzuna(): Promise<RefreshResult> {
  const log = await prisma.refreshLog.create({ data: {} });

  try {
    const rawJobs = await fetchAdzunaJobs();
    const mapped = rawJobs.map(mapAdzunaJob).filter(Boolean) as NonNullable<ReturnType<typeof mapAdzunaJob>>[];

    let added = 0;
    let skipped = 0;

    for (const job of mapped) {
      // Skip if we already have this adzunaId
      const existing = await prisma.job.findUnique({
        where: { adzunaId: job.adzunaId },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.job.create({
        data: {
          title: job.title,
          company: job.company,
          locationZone: job.locationZone,
          workMode: job.workMode,
          minExp: job.minExp,
          maxExp: job.maxExp,
          salaryMinLPA: job.salaryMinLPA,
          salaryMaxLPA: job.salaryMaxLPA,
          stackTags: job.stackTags,
          jdText: job.jdText,
          sourceType: job.sourceType,
          postedAt: job.postedAt,
          applyUrl: job.applyUrl,
          adzunaId: job.adzunaId,
          source: "adzuna",
          verified: false,
          repostCount: 0,
          reports: 0,
        },
      });
      added++;
    }

    await prisma.refreshLog.update({
      where: { id: log.id },
      data: {
        completedAt: new Date(),
        jobsFetched: rawJobs.length,
        jobsAdded: added,
        jobsSkipped: skipped,
        status: "completed",
      },
    });

    return { jobsFetched: rawJobs.length, jobsAdded: added, jobsSkipped: skipped };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    await prisma.refreshLog.update({
      where: { id: log.id },
      data: {
        completedAt: new Date(),
        error: message,
        status: "failed",
      },
    });

    return { jobsFetched: 0, jobsAdded: 0, jobsSkipped: 0, error: message };
  }
}
