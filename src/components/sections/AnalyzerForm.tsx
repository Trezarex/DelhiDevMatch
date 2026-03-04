"use client";

import { useState } from "react";
import { TextareaWithCounter } from "@/components/shared/TextareaWithCounter";
import { GlassCard } from "@/components/shared/GlassCard";
import type { LocationZone } from "@/types";
import { FileSearch, Loader2 } from "lucide-react";

interface AnalyzerFormProps {
  initialJd?: string;
  onAnalyze: (resumeText: string, jdText: string, zone: LocationZone) => void;
  loading: boolean;
}

const ZONES: LocationZone[] = ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"];

export function AnalyzerForm({ initialJd = "", onAnalyze, loading }: AnalyzerFormProps) {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState(initialJd);
  const [zone, setZone] = useState<LocationZone>("Gurgaon");

  const canAnalyze = resumeText.trim().length >= 50 && jdText.trim().length >= 50;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TextareaWithCounter
          label="Your Resume (paste text)"
          value={resumeText}
          onChange={setResumeText}
          placeholder="Paste your resume text here... Include your experience, skills, projects, and education."
          rows={14}
        />
      </GlassCard>

      <GlassCard
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <TextareaWithCounter
          label="Job Description"
          value={jdText}
          onChange={setJdText}
          placeholder="Paste the job description here... Include requirements, responsibilities, and desired skills."
          rows={14}
        />
      </GlassCard>

      <div className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/60">Salary benchmark zone:</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value as LocationZone)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
          >
            {ZONES.map((z) => (
              <option key={z} value={z} className="bg-[var(--night-900)]">
                {z}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onAnalyze(resumeText, jdText, zone)}
          disabled={!canAnalyze || loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-cyan)]/80 text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_var(--neon-cyan)] transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileSearch className="w-4 h-4" />
          )}
          Analyze
        </button>

        {!canAnalyze && (
          <span className="text-xs text-white/30">
            Both fields need at least 50 characters
          </span>
        )}
      </div>
    </div>
  );
}
