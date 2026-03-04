"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlassCard } from "@/components/shared/GlassCard";
import { ProfilePanel, useUserProfile } from "@/components/sections/ProfilePanel";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { Badge } from "@/components/shared/Badge";
import { seedJobs } from "@/lib/data/jobs.seed";
import { computeTrustScore, computeMatchScore } from "@/lib/scoring";
import {
  Briefcase, FileSearch, MessageSquare, TrendingUp,
  Shield, Target, ArrowRight, Rocket,
} from "lucide-react";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const [profile, setProfile] = useUserProfile();

  // Quick stats
  const jobsWithScores = seedJobs.map((job) => ({
    job,
    trust: computeTrustScore(job),
    match: computeMatchScore(job, profile),
  }));

  const topMatches = [...jobsWithScores]
    .sort((a, b) => b.match.total - a.match.total)
    .slice(0, 3);

  const trustedJobs = jobsWithScores.filter((j) => j.trust.total >= 60).length;
  const avgMatch = Math.round(
    jobsWithScores.reduce((s, j) => s + j.match.total, 0) / jobsWithScores.length
  );
  const ghostJobs = jobsWithScores.filter((j) => j.trust.total < 40).length;

  return (
    <div className="space-y-8">
      <SectionHeading
        title="Dashboard"
        subtitle="Your personalized Delhi/NCR tech job hub."
        align="left"
      />

      {/* Quick Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeUp}>
          <GlassCard className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--neon-cyan)]/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[var(--neon-cyan)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{seedJobs.length}</div>
              <div className="text-xs text-white/40">Total Jobs</div>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <GlassCard className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--neon-green)]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[var(--neon-green)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{trustedJobs}</div>
              <div className="text-xs text-white/40">Trusted (60+)</div>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <GlassCard className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--neon-purple)]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[var(--neon-purple)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{avgMatch}%</div>
              <div className="text-xs text-white/40">Avg Match</div>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <GlassCard className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--neon-magenta)]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--neon-magenta)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{ghostJobs}</div>
              <div className="text-xs text-white/40">Ghost Warnings</div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Top Matches</h3>
            <Link
              href="/app/jobs"
              className="flex items-center gap-1 text-xs text-[var(--neon-cyan)] hover:underline"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {topMatches.map(({ job, trust, match }) => (
            <Link key={job.id} href="/app/jobs">
              <GlassCard className="flex items-center gap-4 hover:glow-border transition-all cursor-pointer">
                <ScoreRing score={match.total} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{job.title}</div>
                  <div className="text-xs text-white/40">{job.company} &bull; {job.locationZone}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.stackTags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="ghost" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </GlassCard>
            </Link>
          ))}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Link href="/app/analyzer">
              <GlassCard className="flex items-center gap-3 hover:glow-border transition-all cursor-pointer group">
                <FileSearch className="w-8 h-8 text-[var(--neon-magenta)]" />
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-[var(--neon-magenta)] transition-colors">
                    Resume Analyzer
                  </div>
                  <div className="text-xs text-white/40">Check ATS compatibility</div>
                </div>
              </GlassCard>
            </Link>
            <Link href="/app/interview">
              <GlassCard className="flex items-center gap-3 hover:glow-border transition-all cursor-pointer group">
                <MessageSquare className="w-8 h-8 text-[var(--neon-gold)]" />
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-[var(--neon-gold)] transition-colors">
                    Mock Interview
                  </div>
                  <div className="text-xs text-white/40">Practice with feedback</div>
                </div>
              </GlassCard>
            </Link>
          </div>

          {/* Bulk Apply Placeholder */}
          <GlassCard className="text-center py-8 opacity-60">
            <Rocket className="w-8 h-8 text-[var(--neon-purple)] mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">Bulk Apply Optimizer</div>
            <div className="text-xs text-white/40">Coming soon</div>
          </GlassCard>
        </div>

        {/* Profile Panel */}
        <div>
          <ProfilePanel profile={profile} onSave={setProfile} />
        </div>
      </div>
    </div>
  );
}
