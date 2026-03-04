"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X, MapPin, Building, IndianRupee, Clock, ExternalLink, FileSearch, MessageSquare,
  CheckCircle, AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { ScorePill } from "@/components/shared/ScorePill";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { formatSalary, formatDate } from "@/lib/utils";
import type { Job, TrustScoreBreakdown, MatchScoreBreakdown } from "@/types";

interface JobDetailsDrawerProps {
  job: Job | null;
  trustScore: TrustScoreBreakdown | null;
  matchScore: MatchScoreBreakdown | null;
  onClose: () => void;
}

const workModeColors = {
  remote: "green" as const,
  hybrid: "cyan" as const,
  office: "gold" as const,
};

export function JobDetailsDrawer({
  job,
  trustScore,
  matchScore,
  onClose,
}: JobDetailsDrawerProps) {
  return (
    <AnimatePresence>
      {job && trustScore && matchScore && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg glass border-l border-white/10 overflow-y-auto custom-scrollbar"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{job.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-white/50">
                    <Building className="w-4 h-4" />
                    {job.company}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Ghost warning */}
              {trustScore.total < 40 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--neon-magenta)]/10 border border-[var(--neon-magenta)]/30 mb-4">
                  <AlertTriangle className="w-4 h-4 text-[var(--neon-magenta)] shrink-0" />
                  <p className="text-xs text-[var(--neon-magenta)]">
                    Low trust score. This listing may be outdated or a ghost job. Verify directly with the company before applying.
                  </p>
                </div>
              )}

              {/* Scores */}
              <div className="flex items-center gap-4 mb-6">
                <div className="glass rounded-lg p-3 flex items-center gap-3">
                  <ScoreRing score={matchScore.total} breakdown={matchScore} size={56} />
                  <div>
                    <div className="text-xs text-white/40">Match</div>
                    <div className="text-sm font-semibold text-white">{matchScore.total}%</div>
                  </div>
                </div>
                <ScorePill score={trustScore.total} breakdown={trustScore} />
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-white/40 mb-1">Location</div>
                  <div className="flex items-center gap-1 text-sm text-white">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.locationZone}
                  </div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-white/40 mb-1">Work Mode</div>
                  <Badge variant={workModeColors[job.workMode]}>{job.workMode}</Badge>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-white/40 mb-1">Salary Range</div>
                  <div className="flex items-center gap-1 text-sm text-white">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {formatSalary(job.salaryMinLPA)} - {formatSalary(job.salaryMaxLPA)}
                  </div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-white/40 mb-1">Experience</div>
                  <div className="text-sm text-white">{job.minExp}-{job.maxExp} years</div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-white/40 mb-1">Posted</div>
                  <div className="flex items-center gap-1 text-sm text-white">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(job.postedAt)}
                  </div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-white/40 mb-1">Source</div>
                  <div className="flex items-center gap-1 text-sm text-white">
                    {job.verified && <CheckCircle className="w-3.5 h-3.5 text-[var(--neon-green)]" />}
                    {job.sourceType.replace("_", " ")}
                  </div>
                </div>
              </div>

              {/* Stack */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/60 mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {job.stackTags.map((tag) => (
                    <Badge key={tag} variant="cyan">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* JD */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white/60 mb-2">Job Description</h4>
                <div className="glass rounded-lg p-4 text-sm text-white/70 leading-relaxed whitespace-pre-line custom-scrollbar max-h-64 overflow-y-auto">
                  {job.jdText}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Link
                  href={`/app/analyzer?jd=${encodeURIComponent(job.jdText.slice(0, 500))}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] text-sm font-medium hover:bg-[var(--neon-cyan)]/10 transition-colors"
                >
                  <FileSearch className="w-4 h-4" />
                  Analyze this JD
                </Link>
                <Link
                  href={`/app/interview?job=${job.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--neon-magenta)]/40 text-[var(--neon-magenta)] text-sm font-medium hover:bg-[var(--neon-magenta)]/10 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Start Mock Interview
                </Link>
                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-cyan)]/80 text-black text-sm font-semibold hover:shadow-[0_0_20px_var(--neon-cyan)] transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
