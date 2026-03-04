import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { dbJobToAppJob } from "@/lib/db/mappers";
import { verifyAdmin } from "@/lib/auth/verify";
import { jobUpdateSchema } from "@/lib/validation/job";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = jobUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const updated = await prisma.job.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.company !== undefined && { company: data.company }),
      ...(data.locationZone !== undefined && { locationZone: data.locationZone }),
      ...(data.workMode !== undefined && { workMode: data.workMode }),
      ...(data.minExp !== undefined && { minExp: data.minExp }),
      ...(data.maxExp !== undefined && { maxExp: data.maxExp }),
      ...(data.salaryMinLPA !== undefined && { salaryMinLPA: data.salaryMinLPA }),
      ...(data.salaryMaxLPA !== undefined && { salaryMaxLPA: data.salaryMaxLPA }),
      ...(data.stackTags !== undefined && { stackTags: JSON.stringify(data.stackTags) }),
      ...(data.jdText !== undefined && { jdText: data.jdText }),
      ...(data.sourceType !== undefined && { sourceType: data.sourceType }),
      ...(data.postedAt !== undefined && { postedAt: new Date(data.postedAt) }),
      ...(data.repostCount !== undefined && { repostCount: data.repostCount }),
      ...(data.verified !== undefined && { verified: data.verified }),
      ...(data.companyLogo !== undefined && { companyLogo: data.companyLogo ?? null }),
      ...(data.applyUrl !== undefined && { applyUrl: data.applyUrl ?? null }),
    },
  });

  return NextResponse.json(dbJobToAppJob(updated));
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Soft delete
  await prisma.job.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
