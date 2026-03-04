"use client";

import { Badge } from "@/components/shared/Badge";
import { cn } from "@/lib/utils";
import type { FilterState, StackTag, LocationZone, WorkMode, SeniorityLevel } from "@/types";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FiltersPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const STACK_OPTIONS: StackTag[] = [
  "React", "Next.js", "Node.js", "TypeScript", "Python", "Go", "Java",
  "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "LLM", "GenAI",
];

const ZONE_OPTIONS: LocationZone[] = ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"];

const WORK_MODE_OPTIONS: WorkMode[] = ["remote", "hybrid", "office"];

const SENIORITY_OPTIONS: { value: SeniorityLevel | ""; label: string }[] = [
  { value: "", label: "All Levels" },
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior (0-2)" },
  { value: "mid", label: "Mid (2-5)" },
  { value: "senior", label: "Senior (5-10)" },
  { value: "lead", label: "Lead (7+)" },
  { value: "principal", label: "Principal (10+)" },
];

const SORT_OPTIONS = [
  { value: "trust_desc" as const, label: "Trust Score" },
  { value: "match_desc" as const, label: "Match Score" },
  { value: "newest" as const, label: "Newest" },
];

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleStack = (tag: StackTag) => {
    const tags = filters.stackTags.includes(tag)
      ? filters.stackTags.filter((t) => t !== tag)
      : [...filters.stackTags, tag];
    onChange({ ...filters, stackTags: tags });
  };

  const toggleZone = (zone: LocationZone) => {
    const zones = filters.zones.includes(zone)
      ? filters.zones.filter((z) => z !== zone)
      : [...filters.zones, zone];
    onChange({ ...filters, zones });
  };

  const toggleWorkMode = (mode: WorkMode) => {
    const modes = filters.workModes.includes(mode)
      ? filters.workModes.filter((m) => m !== mode)
      : [...filters.workModes, mode];
    onChange({ ...filters, workModes: modes });
  };

  const activeFilterCount =
    filters.stackTags.length +
    filters.zones.length +
    filters.workModes.length +
    (filters.expLevel ? 1 : 0) +
    (filters.trustScoreMin > 0 ? 1 : 0);

  const clearAll = () =>
    onChange({
      stackTags: [],
      expLevel: "",
      salaryMin: 0,
      salaryMax: 200,
      zones: [],
      workModes: [],
      trustScoreMin: 0,
      sortBy: "trust_desc",
    });

  return (
    <div className="glass rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]">
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white/60"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-white/40">Sort:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...filters, sortBy: opt.value })}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
              filters.sortBy === opt.value
                ? "bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30"
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Expandable filters */}
      <div className={cn("space-y-4 overflow-hidden transition-all", expanded ? "max-h-[600px]" : "max-h-0")}>
        {/* Stack Tags */}
        <div>
          <div className="text-xs text-white/40 mb-2">Tech Stack</div>
          <div className="flex flex-wrap gap-1.5">
            {STACK_OPTIONS.map((tag) => (
              <Badge
                key={tag}
                variant="cyan"
                active={filters.stackTags.includes(tag)}
                onClick={() => toggleStack(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="text-xs text-white/40 mb-2">Location</div>
          <div className="flex flex-wrap gap-1.5">
            {ZONE_OPTIONS.map((zone) => (
              <Badge
                key={zone}
                variant="purple"
                active={filters.zones.includes(zone)}
                onClick={() => toggleZone(zone)}
              >
                {zone}
              </Badge>
            ))}
          </div>
        </div>

        {/* Work Mode */}
        <div>
          <div className="text-xs text-white/40 mb-2">Work Mode</div>
          <div className="flex flex-wrap gap-1.5">
            {WORK_MODE_OPTIONS.map((mode) => (
              <Badge
                key={mode}
                variant="green"
                active={filters.workModes.includes(mode)}
                onClick={() => toggleWorkMode(mode)}
              >
                {mode}
              </Badge>
            ))}
          </div>
        </div>

        {/* Seniority */}
        <div>
          <div className="text-xs text-white/40 mb-2">Experience Level</div>
          <select
            value={filters.expLevel}
            onChange={(e) => onChange({ ...filters, expLevel: e.target.value as SeniorityLevel | "" })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
          >
            {SENIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[var(--night-900)]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Trust Score Min */}
        <div>
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            <span>Min Trust Score</span>
            <span className="text-[var(--neon-cyan)]">{filters.trustScoreMin}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={filters.trustScoreMin}
            onChange={(e) => onChange({ ...filters, trustScoreMin: Number(e.target.value) })}
            className="w-full accent-[var(--neon-cyan)]"
          />
        </div>
      </div>

      {/* Toggle expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-2 text-xs text-white/30 hover:text-white/50 transition-colors"
      >
        {expanded ? "Show less" : "Show more filters"}
      </button>
    </div>
  );
}
