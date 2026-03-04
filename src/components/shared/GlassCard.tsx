"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
}

export function GlassCard({ children, glow, className, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn("glass rounded-xl p-5", glow && "glow-border", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
