import { z } from "zod";

export const jobCreateSchema = z.object({
  title: z.string().min(3).max(200),
  company: z.string().min(1).max(100),
  locationZone: z.enum(["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"]),
  workMode: z.enum(["remote", "hybrid", "office"]),
  minExp: z.number().int().min(0).max(30),
  maxExp: z.number().int().min(0).max(30),
  salaryMinLPA: z.number().min(0).max(200),
  salaryMaxLPA: z.number().min(0).max(200),
  stackTags: z.array(z.string()).min(1).max(15),
  jdText: z.string().min(50).max(5000),
  sourceType: z.enum(["career_page", "referral", "linkedin", "job_board", "adzuna"]),
  postedAt: z.string().datetime().optional(),
  repostCount: z.number().int().min(0).optional(),
  verified: z.boolean().optional(),
  companyLogo: z.string().url().optional(),
  applyUrl: z.string().url().optional(),
});

export const jobUpdateSchema = jobCreateSchema.partial();

export type JobCreateInput = z.infer<typeof jobCreateSchema>;
export type JobUpdateInput = z.infer<typeof jobUpdateSchema>;
