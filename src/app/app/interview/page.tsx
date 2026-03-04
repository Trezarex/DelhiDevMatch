"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { InterviewCoach } from "@/components/sections/InterviewCoach";
import { TextareaWithCounter } from "@/components/shared/TextareaWithCounter";
import { GlassCard } from "@/components/shared/GlassCard";
import { Badge } from "@/components/shared/Badge";
import { seedJobs } from "@/lib/data/jobs.seed";
import { MessageSquare, ArrowRight } from "lucide-react";

function InterviewContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job");

  const preselectedJob = jobId ? seedJobs.find((j) => j.id === jobId) : null;

  const [jdText, setJdText] = useState(preselectedJob?.jdText ?? "");
  const [jobTitle, setJobTitle] = useState(preselectedJob?.title ?? "");
  const [started, setStarted] = useState(!!preselectedJob);

  if (started && jdText.trim().length >= 50) {
    return <InterviewCoach jdText={jdText} jobTitle={jobTitle} />;
  }

  return (
    <>
      {/* Quick select from jobs */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3">Quick Select a Job</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {seedJobs.slice(0, 6).map((job) => (
            <GlassCard
              key={job.id}
              className="cursor-pointer hover:glow-border transition-all"
              onClick={() => {
                setJdText(job.jdText);
                setJobTitle(job.title);
                setStarted(true);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-sm font-semibold text-white truncate">{job.title}</div>
              <div className="text-xs text-white/40 mb-2">{job.company}</div>
              <div className="flex flex-wrap gap-1">
                {job.stackTags.slice(0, 3).map((t) => (
                  <Badge key={t} variant="ghost" className="text-[10px]">{t}</Badge>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Or paste JD */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3">Or Paste a Job Description</h3>
        <GlassCard>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">Job Title (optional)</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[var(--neon-cyan)]/50 focus:outline-none"
              />
            </div>
            <TextareaWithCounter
              label="Job Description"
              value={jdText}
              onChange={setJdText}
              placeholder="Paste the full job description here..."
              rows={8}
            />
            <button
              onClick={() => setStarted(true)}
              disabled={jdText.trim().length < 50}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-cyan)]/80 text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_var(--neon-cyan)] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Start Interview
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </div>
    </>
  );
}

export default function InterviewPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Mock Interview Coach"
        subtitle="Select a job or paste a JD to start a practice interview session."
        align="left"
      />
      <Suspense fallback={<div className="text-center text-white/30 py-8">Loading...</div>}>
        <InterviewContent />
      </Suspense>
    </div>
  );
}
