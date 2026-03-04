"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Target, FileSearch, MessageSquare } from "lucide-react";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-cyan)]/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-magenta)]/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
              Delhi/NCR Tech Jobs &mdash; Verified & Scored
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-black tracking-tight text-shimmer leading-tight"
          >
            Find Your Next
            <br />
            <span className="text-[var(--neon-cyan)]">Delhi Tech Role</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Trust-scored job listings, AI-powered resume analysis, and mock interview coaching
            &mdash; built specifically for the Delhi/NCR tech ecosystem.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/app/jobs"
              className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-cyan)]/80 text-black font-semibold text-sm hover:shadow-[0_0_30px_var(--neon-cyan)] transition-all duration-300"
            >
              Explore Jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/app/analyzer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white/80 text-sm font-medium hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Analyze Your Resume
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              icon: Shield,
              title: "Trust Score",
              desc: "Every listing scored 0-100 for freshness, source & verification.",
              color: "var(--neon-green)",
            },
            {
              icon: Target,
              title: "Match Score",
              desc: "Personalized fit based on your skills, seniority & preferences.",
              color: "var(--neon-cyan)",
            },
            {
              icon: FileSearch,
              title: "Resume Analyzer",
              desc: "Find ATS gaps, missing keywords & get bullet rewrites.",
              color: "var(--neon-magenta)",
            },
            {
              icon: MessageSquare,
              title: "Interview Coach",
              desc: "Practice with role-specific questions & get instant feedback.",
              color: "var(--neon-gold)",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="glass rounded-xl p-5 text-left group hover:glow-border transition-all duration-300"
            >
              <feature.icon
                className="w-8 h-8 mb-3"
                style={{ color: feature.color }}
              />
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-white/50">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
