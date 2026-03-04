import type { Job as PrismaJob } from "@/generated/prisma";
import type { Job, StackTag, LocationZone, WorkMode, SourceType } from "@/types";

export function dbJobToAppJob(dbJob: PrismaJob): Job {
  return {
    id: dbJob.id,
    title: dbJob.title,
    company: dbJob.company,
    locationZone: dbJob.locationZone as LocationZone,
    workMode: dbJob.workMode as WorkMode,
    minExp: dbJob.minExp,
    maxExp: dbJob.maxExp,
    salaryMinLPA: dbJob.salaryMinLPA,
    salaryMaxLPA: dbJob.salaryMaxLPA,
    stackTags: JSON.parse(dbJob.stackTags) as StackTag[],
    jdText: dbJob.jdText,
    sourceType: dbJob.sourceType as SourceType,
    postedAt: dbJob.postedAt.toISOString(),
    repostCount: dbJob.repostCount,
    verified: dbJob.verified,
    reports: dbJob.reports,
    companyLogo: dbJob.companyLogo ?? undefined,
    applyUrl: dbJob.applyUrl ?? undefined,
  };
}

export function appJobToDbInput(job: Job, source: string = "manual") {
  return {
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
    source,
  };
}
