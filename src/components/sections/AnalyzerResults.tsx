"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { Badge } from "@/components/shared/Badge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import type { AnalyzerResult } from "@/types";
import { AlertTriangle, CheckCircle, ArrowRight, IndianRupee, Lightbulb } from "lucide-react";
import { formatSalary } from "@/lib/utils";

interface AnalyzerResultsProps {
  result: AnalyzerResult;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function AnalyzerResults({ result }: AnalyzerResultsProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6 mt-8"
    >
      {/* ATS Score */}
      <motion.div variants={fadeUp}>
        <GlassCard glow className="flex items-center gap-6">
          <ScoreRing score={result.atsScore} size={72} strokeWidth={5} />
          <div>
            <h3 className="text-lg font-bold text-white">ATS Compatibility Score</h3>
            <p className="text-sm text-white/50 mt-1">
              {result.atsScore >= 80
                ? "Excellent! Your resume matches most JD keywords."
                : result.atsScore >= 60
                  ? "Good match but some keywords are missing. Review below."
                  : "Needs improvement. Several important keywords are missing."}
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Keywords */}
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-[var(--neon-gold)]" />
              <h4 className="text-sm font-semibold text-white">Missing Keywords</h4>
              <span className="ml-auto text-xs text-white/30">
                {result.missingKeywords.length} found
              </span>
            </div>
            {result.missingKeywords.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-[var(--neon-green)]">
                <CheckCircle className="w-4 h-4" />
                All JD keywords are present in your resume!
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw) => (
                  <Badge key={kw} variant="gold">{kw}</Badge>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Skill Gaps */}
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-[var(--neon-magenta)]" />
              <h4 className="text-sm font-semibold text-white">Skill Gaps</h4>
              <span className="ml-auto text-xs text-white/30">
                {result.skillGaps.length} found
              </span>
            </div>
            {result.skillGaps.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-[var(--neon-green)]">
                <CheckCircle className="w-4 h-4" />
                No major skill gaps detected!
              </div>
            ) : (
              <ul className="space-y-2">
                {result.skillGaps.map((gap) => (
                  <li key={gap} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="w-1 h-1 rounded-full bg-[var(--neon-magenta)] mt-2 shrink-0" />
                    {gap}
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Bullet Rewrites */}
      {result.bulletRewrites.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-[var(--neon-cyan)]" />
              <h4 className="text-sm font-semibold text-white">Bullet Rewrite Suggestions</h4>
            </div>
            <div className="space-y-4">
              {result.bulletRewrites.map((br, i) => (
                <div key={i} className="glass rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-[10px] text-white/30 uppercase">Original</span>
                    <p className="text-sm text-white/50">{br.original}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--neon-cyan)]">
                    <ArrowRight className="w-3 h-3" />
                    <span className="text-[10px] uppercase">Improved</span>
                  </div>
                  <p className="text-sm text-white/80">{br.improved}</p>
                  <p className="text-xs text-[var(--neon-gold)]">{br.reason}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Salary Benchmark */}
      <motion.div variants={fadeUp}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="w-4 h-4 text-[var(--neon-green)]" />
            <h4 className="text-sm font-semibold text-white">
              Delhi/NCR Salary Benchmark ({result.salaryBenchmark.zone})
            </h4>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-xs text-white/40 mb-1">Low</div>
              <div className="text-lg font-bold text-white/60">
                {formatSalary(result.salaryBenchmark.lowLPA)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[var(--neon-green)] mb-1">Mid</div>
              <div className="text-xl font-bold text-[var(--neon-green)]">
                {formatSalary(result.salaryBenchmark.midLPA)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-white/40 mb-1">High</div>
              <div className="text-lg font-bold text-white/60">
                {formatSalary(result.salaryBenchmark.highLPA)}
              </div>
            </div>
          </div>
          {/* Bar visualization */}
          <div className="relative h-3 rounded-full bg-white/10 overflow-hidden mb-2">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--neon-magenta)]/60 via-[var(--neon-green)] to-[var(--neon-cyan)]/60"
              style={{ width: "100%" }}
            />
          </div>
          <p className="text-xs text-white/40">{result.salaryBenchmark.note}</p>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
