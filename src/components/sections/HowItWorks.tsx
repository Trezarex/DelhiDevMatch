"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { UserPlus, Search, FileSearch, Zap } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Set Your Profile",
    desc: "Add your skills, experience, preferred zones, and salary range.",
    color: "var(--neon-cyan)",
  },
  {
    icon: Search,
    title: "Browse Scored Jobs",
    desc: "Every listing has a Trust Score and personalized Match Score.",
    color: "var(--neon-green)",
  },
  {
    icon: FileSearch,
    title: "Analyze & Optimize",
    desc: "Compare your resume against JDs. Get keyword gaps and bullet rewrites.",
    color: "var(--neon-magenta)",
  },
  {
    icon: Zap,
    title: "Practice & Apply",
    desc: "Mock interview with feedback, then apply with confidence.",
    color: "var(--neon-gold)",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="How It Works"
          subtitle="Four simple steps to land your ideal Delhi/NCR tech role."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative glass rounded-xl p-6 text-center"
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}40` }}
              >
                <step.icon className="w-5 h-5" style={{ color: step.color }} />
              </div>
              <div
                className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: step.color, color: "#0a0a12" }}
              >
                {i + 1}
              </div>
              <h3 className="text-white font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-white/50">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
