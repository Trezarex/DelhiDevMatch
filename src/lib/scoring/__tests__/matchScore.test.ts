import { describe, it, expect } from "vitest";
import { computeMatchScore } from "../matchScore";
import type { Job, UserProfile } from "@/types";

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "test-1",
    title: "Frontend Engineer",
    company: "TestCo",
    locationZone: "Gurgaon",
    workMode: "hybrid",
    minExp: 2,
    maxExp: 5,
    salaryMinLPA: 15,
    salaryMaxLPA: 30,
    stackTags: ["React", "TypeScript", "Next.js", "Tailwind"],
    jdText: "Test JD",
    sourceType: "career_page",
    postedAt: new Date().toISOString(),
    repostCount: 0,
    verified: true,
    reports: 0,
    ...overrides,
  };
}

const perfectProfile: UserProfile = {
  name: "Test",
  email: "test@test.com",
  skills: ["React", "TypeScript", "Next.js", "Tailwind"],
  experienceYears: 3,
  seniorityLevel: "mid",
  preferredZones: ["Gurgaon"],
  preferredWorkMode: ["hybrid"],
  desiredSalaryMinLPA: 15,
  desiredSalaryMaxLPA: 30,
  resumeText: "",
};

describe("computeMatchScore", () => {
  it("returns high score for perfect match", () => {
    const result = computeMatchScore(makeJob(), perfectProfile);
    expect(result.total).toBeGreaterThanOrEqual(80);
  });

  it("returns lower skill overlap for mismatched skills", () => {
    const profile: UserProfile = {
      ...perfectProfile,
      skills: ["Python", "Django"],
    };
    const result = computeMatchScore(makeJob(), profile);
    expect(result.skillOverlap).toBeLessThan(25);
  });

  it("returns higher score when skills fully overlap", () => {
    const result = computeMatchScore(makeJob(), perfectProfile);
    expect(result.skillOverlap).toBe(50);
  });

  it("handles salary fit - complete overlap", () => {
    const result = computeMatchScore(makeJob(), perfectProfile);
    expect(result.salaryFit).toBeGreaterThanOrEqual(12);
  });

  it("penalizes salary mismatch", () => {
    const profile: UserProfile = {
      ...perfectProfile,
      desiredSalaryMinLPA: 80,
      desiredSalaryMaxLPA: 100,
    };
    const result = computeMatchScore(makeJob(), profile);
    expect(result.salaryFit).toBeLessThan(10);
  });

  it("gives full location fit for matching zone and mode", () => {
    const result = computeMatchScore(makeJob(), perfectProfile);
    expect(result.locationFit).toBe(15);
  });

  it("gives full location fit for remote jobs regardless of zone", () => {
    const job = makeJob({ workMode: "remote", locationZone: "Noida" });
    const profile: UserProfile = {
      ...perfectProfile,
      preferredZones: ["Delhi"],
      preferredWorkMode: ["remote"],
    };
    const result = computeMatchScore(job, profile);
    expect(result.locationFit).toBe(15);
  });

  it("penalizes mismatched zone for office jobs", () => {
    const job = makeJob({ workMode: "office", locationZone: "Noida" });
    const profile: UserProfile = {
      ...perfectProfile,
      preferredZones: ["Gurgaon"],
      preferredWorkMode: ["office"],
    };
    const result = computeMatchScore(job, profile);
    expect(result.locationFit).toBeLessThan(12);
  });

  it("returns breakdown object with all fields", () => {
    const result = computeMatchScore(makeJob(), perfectProfile);
    expect(result).toHaveProperty("skillOverlap");
    expect(result).toHaveProperty("seniorityFit");
    expect(result).toHaveProperty("salaryFit");
    expect(result).toHaveProperty("locationFit");
    expect(result).toHaveProperty("total");
    expect(result.total).toBe(
      result.skillOverlap + result.seniorityFit + result.salaryFit + result.locationFit
    );
  });

  it("clamps total between 0 and 100", () => {
    const result = computeMatchScore(makeJob(), perfectProfile);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
  });
});
