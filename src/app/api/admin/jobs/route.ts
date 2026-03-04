import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { dbJobToAppJob } from "@/lib/db/mappers";
import { verifyAdmin } from "@/lib/auth/verify";
import { jobCreateSchema } from "@/lib/validation/job";

export async function GET(request: Request) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const dbJobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });

  const jobs = dbJobs.map((j) => ({
    ...dbJobToAppJob(j),
    isActive: j.isActive,
    source: j.source,
    adzunaId: j.adzunaId,
    createdAt: j.createdAt.toISOString(),
  }));

  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const parsed = jobCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const dbJob = await prisma.job.create({
    data: {
      title: data.title,
      company: data.company,
      locationZone: data.locationZone,
      workMode: data.workMode,
      minExp: data.minExp,
      maxExp: data.maxExp,
      salaryMinLPA: data.salaryMinLPA,
      salaryMaxLPA: data.salaryMaxLPA,
      stackTags: JSON.stringify(data.stackTags),
      jdText: data.jdText,
      sourceType: data.sourceType,
      postedAt: data.postedAt ? new Date(data.postedAt) : new Date(),
      repostCount: data.repostCount ?? 0,
      verified: data.verified ?? false,
      companyLogo: data.companyLogo ?? null,
      applyUrl: data.applyUrl ?? null,
      source: "manual",
    },
  });

  return NextResponse.json(dbJobToAppJob(dbJob), { status: 201 });
}
