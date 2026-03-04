import type { Job, MatchScoreBreakdown, UserProfile, SeniorityLevel } from "@/types";
import { clamp } from "@/lib/utils";

const SENIORITY_YEARS: Record<SeniorityLevel, [number, number]> = {
  intern: [0, 1],
  junior: [0, 2],
  mid: [2, 5],
  senior: [5, 10],
  lead: [7, 14],
  principal: [10, 20],
};

function computeSkillOverlap(userSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 50;
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const matches = jobSkills.filter((s) => userSet.has(s.toLowerCase()));
  return Math.round((matches.length / jobSkills.length) * 100);
}

function computeSeniorityFit(userExp: number, userLevel: SeniorityLevel, jobMinExp: number, jobMaxExp: number): number {
  // Check if user experience falls within job range
  if (userExp >= jobMinExp && userExp <= jobMaxExp) return 100;

  // Partial credit for being close
  const midpoint = (jobMinExp + jobMaxExp) / 2;
  const range = (jobMaxExp - jobMinExp) / 2 || 1;
  const distance = Math.abs(userExp - midpoint);
  const fit = Math.max(0, 100 - (distance / range) * 50);

  return Math.round(fit);
}

function computeSalaryFit(
  userMin: number,
  userMax: number,
  jobMin: number,
  jobMax: number
): number {
  // Check overlap between salary ranges
  const overlapStart = Math.max(userMin, jobMin);
  const overlapEnd = Math.min(userMax, jobMax);

  if (overlapStart <= overlapEnd) {
    const overlap = overlapEnd - overlapStart;
    const userRange = userMax - userMin || 1;
    return Math.round(Math.min((overlap / userRange) * 100, 100));
  }

  // No overlap - compute penalty based on distance
  const gap = overlapStart - overlapEnd;
  const avgSalary = (userMin + userMax) / 2 || 1;
  return Math.round(Math.max(0, 100 - (gap / avgSalary) * 200));
}

function computeLocationFit(
  userZones: string[],
  userWorkModes: string[],
  jobZone: string,
  jobWorkMode: string
): number {
  let score = 0;

  // Zone match (60% of location score)
  if (jobWorkMode === "remote") {
    score += 60; // Remote works for everyone
  } else if (userZones.includes(jobZone)) {
    score += 60;
  } else {
    score += 10; // Different zone penalty
  }

  // Work mode match (40% of location score)
  if (userWorkModes.includes(jobWorkMode)) {
    score += 40;
  } else {
    score += 10;
  }

  return score;
}

export function computeMatchScore(job: Job, profile: UserProfile): MatchScoreBreakdown {
  const skillOverlapRaw = computeSkillOverlap(profile.skills, job.stackTags);
  const seniorityFitRaw = computeSeniorityFit(
    profile.experienceYears,
    profile.seniorityLevel,
    job.minExp,
    job.maxExp
  );
  const salaryFitRaw = computeSalaryFit(
    profile.desiredSalaryMinLPA,
    profile.desiredSalaryMaxLPA,
    job.salaryMinLPA,
    job.salaryMaxLPA
  );
  const locationFitRaw = computeLocationFit(
    profile.preferredZones,
    profile.preferredWorkMode,
    job.locationZone,
    job.workMode
  );

  // Weighted scores
  const skillOverlap = Math.round(skillOverlapRaw * 0.5);
  const seniorityFit = Math.round(seniorityFitRaw * 0.2);
  const salaryFit = Math.round(salaryFitRaw * 0.15);
  const locationFit = Math.round(locationFitRaw * 0.15);

  const total = clamp(skillOverlap + seniorityFit + salaryFit + locationFit, 0, 100);

  return {
    skillOverlap,
    seniorityFit,
    salaryFit,
    locationFit,
    total,
  };
}
