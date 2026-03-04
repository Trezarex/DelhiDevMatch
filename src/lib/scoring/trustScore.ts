import type { Job, TrustScoreBreakdown } from "@/types";
import { clamp, daysSince } from "@/lib/utils";

function freshnessScore(postedAt: string): number {
  const days = daysSince(postedAt);
  if (days <= 0) return 40;
  if (days <= 7) return 30;
  if (days <= 21) return 15;
  if (days <= 60) return 5;
  return 0;
}

function sourceReliabilityScore(sourceType: Job["sourceType"]): number {
  switch (sourceType) {
    case "career_page":
      return 30;
    case "referral":
      return 25;
    case "linkedin":
      return 15;
    case "job_board":
    case "adzuna":
      return 10;
    default:
      return 0;
  }
}

function repostPenalty(repostCount: number): number {
  if (repostCount === 0) return 0;
  return -Math.min(repostCount * 5, 20);
}

function reportsPenalty(reports: number): number {
  if (reports === 0) return 0;
  return -Math.min(reports * 10, 40);
}

function verificationBonus(verified: boolean): number {
  return verified ? 10 : 0;
}

export function computeTrustScore(job: Job): TrustScoreBreakdown {
  const freshness = freshnessScore(job.postedAt);
  const source = sourceReliabilityScore(job.sourceType);
  const repost = repostPenalty(job.repostCount);
  const reports = reportsPenalty(job.reports);
  const verification = verificationBonus(job.verified);

  const total = clamp(freshness + source + repost + reports + verification, 0, 100);

  return {
    freshness,
    sourceReliability: source,
    repostPenalty: repost,
    reportsPenalty: reports,
    verificationBonus: verification,
    total,
  };
}
