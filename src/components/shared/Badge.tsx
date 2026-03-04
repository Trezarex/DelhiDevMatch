"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "cyan" | "magenta" | "green" | "gold" | "purple" | "ghost";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  cyan: "border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10",
  magenta: "border-[var(--neon-magenta)]/40 text-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10",
  green: "border-[var(--neon-green)]/40 text-[var(--neon-green)] bg-[var(--neon-green)]/10",
  gold: "border-[var(--neon-gold)]/40 text-[var(--neon-gold)] bg-[var(--neon-gold)]/10",
  purple: "border-[var(--neon-purple)]/40 text-[var(--neon-purple)] bg-[var(--neon-purple)]/10",
  ghost: "border-white/20 text-white/60 bg-white/5",
};

const activeVariantStyles: Record<BadgeVariant, string> = {
  cyan: "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/20",
  magenta: "border-[var(--neon-magenta)] text-[var(--neon-magenta)] bg-[var(--neon-magenta)]/20",
  green: "border-[var(--neon-green)] text-[var(--neon-green)] bg-[var(--neon-green)]/20",
  gold: "border-[var(--neon-gold)] text-[var(--neon-gold)] bg-[var(--neon-gold)]/20",
  purple: "border-[var(--neon-purple)] text-[var(--neon-purple)] bg-[var(--neon-purple)]/20",
  ghost: "border-white/40 text-white/80 bg-white/10",
};

export function Badge({
  children,
  variant = "cyan",
  className,
  onClick,
  active,
}: BadgeProps) {
  const styles = active ? activeVariantStyles[variant] : variantStyles[variant];

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-200",
        styles,
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
    >
      {children}
    </span>
  );
}
