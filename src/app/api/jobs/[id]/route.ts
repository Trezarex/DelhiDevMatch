import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { dbJobToAppJob } from "@/lib/db/mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dbJob = await prisma.job.findUnique({ where: { id } });

  if (!dbJob || !dbJob.isActive) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(dbJobToAppJob(dbJob));
}
