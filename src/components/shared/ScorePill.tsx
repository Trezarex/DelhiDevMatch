"use client";

import { cn } from "@/lib/utils";
import { getScoreColor, getScoreLabel } from "@/lib/utils";
import type { TrustScoreBreakdown } from "@/types";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ScorePillProps {
  score: number;
  breakdown?: TrustScoreBreakdown;
  size?: "sm" | "md";
  className?: string;
}

export function ScorePill({ score, breakdown, size = "md", className }: ScorePillProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const Icon = score >= 70 ? ShieldCheck : score >= 40 ? Shield : ShieldAlert;

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-semibold",
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
        )}
        style={{
          borderColor: `${color}66`,
          color: color,
          backgroundColor: `${color}1a`,
        }}
      >
        <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
        <span>{score}</span>
        {size === "md" && <span className="text-xs opacity-70">Trust</span>}
      </div>

      {showTooltip && breakdown && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-lg glass text-xs">
          <div className="font-semibold text-white mb-2">Trust Score Breakdown</div>
          <div className="space-y-1 text-white/70">
            <div className="flex justify-between">
              <span>Freshness</span>
              <span className="text-[var(--neon-green)]">+{breakdown.freshness}</span>
            </div>
            <div className="flex justify-between">
              <span>Source Reliability</span>
              <span className="text-[var(--neon-green)]">+{breakdown.sourceReliability}</span>
            </div>
            {breakdown.repostPenalty < 0 && (
              <div className="flex justify-between">
                <span>Repost Penalty</span>
                <span className="text-[var(--neon-magenta)]">{breakdown.repostPenalty}</span>
              </div>
            )}
            {breakdown.reportsPenalty < 0 && (
              <div className="flex justify-between">
                <span>Reports Penalty</span>
                <span className="text-[var(--neon-magenta)]">{breakdown.reportsPenalty}</span>
              </div>
            )}
            {breakdown.verificationBonus > 0 && (
              <div className="flex justify-between">
                <span>Verified</span>
                <span className="text-[var(--neon-cyan)]">+{breakdown.verificationBonus}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-white/10 font-semibold text-white">
              <span>Total</span>
              <span style={{ color }}>{breakdown.total}</span>
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 rotate-45 bg-[var(--night-800)]" />
        </div>
      )}
    </div>
  );
}
