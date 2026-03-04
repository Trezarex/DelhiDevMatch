"use client";

import { useState, useMemo } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FiltersPanel } from "@/components/sections/FiltersPanel";
import { JobCard } from "@/components/sections/JobCard";
import { JobDetailsDrawer } from "@/components/sections/JobDetailsDrawer";
import { useUserProfile } from "@/components/sections/ProfilePanel";
import { seedJobs } from "@/lib/data/jobs.seed";
import { computeTrustScore, computeMatchScore } from "@/lib/scoring";
import type { FilterState, Job, TrustScoreBreakdown, MatchScoreBreakdown, SeniorityLevel } from "@/types";
import { Search } from "lucide-react";

const SENIORITY_EXP: Record<SeniorityLevel, [number, number]> = {
  intern: [0, 1],
  junior: [0, 2],
  mid: [2, 5],
  senior: [5, 10],
  lead: [7, 14],
  principal: [10, 20],
};

export default function JobsPage() {
  const [profile] = useUserProfile();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    stackTags: [],
    expLevel: "",
    salaryMin: 0,
    salaryMax: 200,
    zones: [],
    workModes: [],
    trustScoreMin: 0,
    sortBy: "trust_desc",
  });

  const jobsWithScores = useMemo(() => {
    return seedJobs.map((job) => ({
      job,
      trust: computeTrustScore(job),
      match: computeMatchScore(job, profile),
    }));
  }, [profile]);

  const filtered = useMemo(() => {
    let result = jobsWithScores;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        ({ job }) =>
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.stackTags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Stack filter
    if (filters.stackTags.length > 0) {
      result = result.filter(({ job }) =>
        filters.stackTags.some((tag) => job.stackTags.includes(tag))
      );
    }

    // Zone filter
    if (filters.zones.length > 0) {
      result = result.filter(({ job }) => filters.zones.includes(job.locationZone));
    }

    // Work mode filter
    if (filters.workModes.length > 0) {
      result = result.filter(({ job }) => filters.workModes.includes(job.workMode));
    }

    // Seniority filter
    if (filters.expLevel) {
      const [minExp, maxExp] = SENIORITY_EXP[filters.expLevel];
      result = result.filter(
        ({ job }) => job.minExp <= maxExp && job.maxExp >= minExp
      );
    }

    // Trust score minimum
    if (filters.trustScoreMin > 0) {
      result = result.filter(({ trust }) => trust.total >= filters.trustScoreMin);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case "trust_desc":
          return b.trust.total - a.trust.total;
        case "match_desc":
          return b.match.total - a.match.total;
        case "newest":
          return new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [jobsWithScores, search, filters]);

  const selectedJobData = selectedJob
    ? jobsWithScores.find(({ job }) => job.id === selectedJob)
    : null;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Job Explorer"
        subtitle={`${filtered.length} of ${seedJobs.length} Delhi/NCR tech jobs`}
        align="left"
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs, companies, or skills..."
          className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 focus:border-[var(--neon-cyan)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--neon-cyan)]/30 transition-colors"
        />
      </div>

      {/* Filters */}
      <FiltersPanel filters={filters} onChange={setFilters} />

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-xl">
          <Search className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">No jobs match your filters.</p>
          <p className="text-xs text-white/20 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(({ job, trust, match }, i) => (
            <JobCard
              key={job.id}
              job={job}
              trustScore={trust}
              matchScore={match}
              onClick={() => setSelectedJob(job.id)}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Drawer */}
      <JobDetailsDrawer
        job={selectedJobData?.job ?? null}
        trustScore={selectedJobData?.trust ?? null}
        matchScore={selectedJobData?.match ?? null}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
