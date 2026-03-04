"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Building, IndianRupee, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { ScorePill } from "@/components/shared/ScorePill";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { formatSalary, formatDate } from "@/lib/utils";
import type { Job, TrustScoreBreakdown, MatchScoreBreakdown } from "@/types";

interface JobCardProps {
  job: Job;
  trustScore: TrustScoreBreakdown;
  matchScore: MatchScoreBreakdown;
  onClick: () => void;
  index?: number;
}

const workModeColors = {
  remote: "green" as const,
  hybrid: "cyan" as const,
  office: "gold" as const,
};

export function JobCard({ job, trustScore, matchScore, onClick, index = 0 }: JobCardProps) {
  const isGhost = trustScore.total < 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="glass rounded-xl p-5 cursor-pointer group hover:glow-border transition-all duration-300 relative"
    >
      {isGhost && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] border border-[var(--neon-magenta)]/30">
          <AlertTriangle className="w-3 h-3" />
          Ghost Job?
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base group-hover:text-[var(--neon-cyan)] transition-colors truncate">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-white/50">
            <Building className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{job.company}</span>
          </div>
        </div>
        <ScoreRing score={matchScore.total} breakdown={matchScore} size={48} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-white/50">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.locationZone}
        </span>
        <Badge variant={workModeColors[job.workMode]} className="text-[10px] px-1.5 py-0">
          {job.workMode}
        </Badge>
        <span className="flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          {formatSalary(job.salaryMinLPA)}-{formatSalary(job.salaryMaxLPA)} /yr
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(job.postedAt)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.stackTags.slice(0, 5).map((tag) => (
          <Badge key={tag} variant="ghost" className="text-[10px]">
            {tag}
          </Badge>
        ))}
        {job.stackTags.length > 5 && (
          <Badge variant="ghost" className="text-[10px]">
            +{job.stackTags.length - 5}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <ScorePill score={trustScore.total} breakdown={trustScore} size="sm" />
        <span className="text-xs text-white/30">
          {job.minExp}-{job.maxExp} yrs exp
        </span>
      </div>
    </motion.div>
  );
}
