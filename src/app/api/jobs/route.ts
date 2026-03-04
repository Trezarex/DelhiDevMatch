import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { dbJobToAppJob } from "@/lib/db/mappers";

export async function GET() {
  const dbJobs = await prisma.job.findMany({
    where: { isActive: true },
    orderBy: { postedAt: "desc" },
  });

  const jobs = dbJobs.map(dbJobToAppJob);
  return NextResponse.json(jobs);
}
