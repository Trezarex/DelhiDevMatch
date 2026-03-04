"use client";

import { cn, getScoreColor } from "@/lib/utils";
import type { MatchScoreBreakdown } from "@/types";
import { useState } from "react";

interface ScoreRingProps {
  score: number;
  breakdown?: MatchScoreBreakdown;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreRing({
  score,
  breakdown,
  size = 56,
  strokeWidth = 4,
  className,
}: ScoreRingProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const color = getScoreColor(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color }}
      >
        {score}
      </span>

      {showTooltip && breakdown && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 rounded-lg glass text-xs">
          <div className="font-semibold text-white mb-2">Match Score Breakdown</div>
          <div className="space-y-1.5 text-white/70">
            <div>
              <div className="flex justify-between mb-0.5">
                <span>Skills (50%)</span>
                <span>{breakdown.skillOverlap}/50</span>
              </div>
              <div className="h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(breakdown.skillOverlap / 50) * 100}%`,
                    backgroundColor: "var(--neon-cyan)",
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-0.5">
                <span>Seniority (20%)</span>
                <span>{breakdown.seniorityFit}/20</span>
              </div>
              <div className="h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(breakdown.seniorityFit / 20) * 100}%`,
                    backgroundColor: "var(--neon-green)",
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-0.5">
                <span>Salary (15%)</span>
                <span>{breakdown.salaryFit}/15</span>
              </div>
              <div className="h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(breakdown.salaryFit / 15) * 100}%`,
                    backgroundColor: "var(--neon-gold)",
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-0.5">
                <span>Location (15%)</span>
                <span>{breakdown.locationFit}/15</span>
              </div>
              <div className="h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(breakdown.locationFit / 15) * 100}%`,
                    backgroundColor: "var(--neon-purple)",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 rotate-45 bg-[var(--night-800)]" />
        </div>
      )}
    </div>
  );
}
