import { describe, it, expect } from "vitest";
import { computeTrustScore } from "../trustScore";
import type { Job } from "@/types";

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: "test-1",
    title: "Test Job",
    company: "TestCo",
    locationZone: "Gurgaon",
    workMode: "hybrid",
    minExp: 2,
    maxExp: 5,
    salaryMinLPA: 15,
    salaryMaxLPA: 30,
    stackTags: ["React", "TypeScript"],
    jdText: "Test JD",
    sourceType: "career_page",
    postedAt: new Date().toISOString(),
    repostCount: 0,
    verified: true,
    reports: 0,
    ...overrides,
  };
}

describe("computeTrustScore", () => {
  it("returns max score for fresh, verified career page job with no reposts/reports", () => {
    const job = makeJob();
    const result = computeTrustScore(job);
    // freshness: 40 (today) + source: 30 (career_page) + verified: 10 = 80
    expect(result.total).toBe(80);
    expect(result.freshness).toBe(40);
    expect(result.sourceReliability).toBe(30);
    expect(result.verificationBonus).toBe(10);
    expect(result.repostPenalty).toBe(0);
    expect(result.reportsPenalty).toBe(0);
  });

  it("penalizes old jobs", () => {
    const old = new Date();
    old.setDate(old.getDate() - 90);
    const job = makeJob({ postedAt: old.toISOString() });
    const result = computeTrustScore(job);
    expect(result.freshness).toBe(0);
  });

  it("gives partial freshness for jobs 1-7 days old", () => {
    const recent = new Date();
    recent.setDate(recent.getDate() - 3);
    const job = makeJob({ postedAt: recent.toISOString() });
    const result = computeTrustScore(job);
    expect(result.freshness).toBe(30);
  });

  it("gives 15 points for 8-21 day old jobs", () => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    const job = makeJob({ postedAt: d.toISOString() });
    const result = computeTrustScore(job);
    expect(result.freshness).toBe(15);
  });

  it("scores different source types correctly", () => {
    expect(computeTrustScore(makeJob({ sourceType: "career_page" })).sourceReliability).toBe(30);
    expect(computeTrustScore(makeJob({ sourceType: "referral" })).sourceReliability).toBe(25);
    expect(computeTrustScore(makeJob({ sourceType: "linkedin" })).sourceReliability).toBe(15);
    expect(computeTrustScore(makeJob({ sourceType: "job_board" })).sourceReliability).toBe(10);
  });

  it("applies repost penalty capped at -20", () => {
    const job = makeJob({ repostCount: 10 });
    const result = computeTrustScore(job);
    expect(result.repostPenalty).toBe(-20);
  });

  it("applies reports penalty capped at -40", () => {
    const job = makeJob({ reports: 5 });
    const result = computeTrustScore(job);
    expect(result.reportsPenalty).toBe(-40);
  });

  it("clamps total to 0-100", () => {
    const job = makeJob({ reports: 10, repostCount: 10, verified: false, sourceType: "job_board" });
    const result = computeTrustScore(job);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
  });

  it("does not give verification bonus when not verified", () => {
    const job = makeJob({ verified: false });
    const result = computeTrustScore(job);
    expect(result.verificationBonus).toBe(0);
  });
});
