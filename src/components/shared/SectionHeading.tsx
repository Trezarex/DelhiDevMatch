"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  shimmer?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  shimmer = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <h2
        className={`text-3xl font-bold tracking-tight sm:text-4xl ${
          shimmer ? "text-shimmer" : "text-white"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-white/60 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
