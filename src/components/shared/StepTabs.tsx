"use client";

import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface StepTabsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepTabs({ steps, currentStep, onStepClick, className }: StepTabsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        const isClickable = onStepClick && (isCompleted || i === currentStep + 1);

        return (
          <button
            key={i}
            onClick={() => isClickable && onStepClick(i)}
            disabled={!isClickable}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              isActive && "glass border border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]",
              isCompleted && "text-[var(--neon-green)] bg-[var(--neon-green)]/10",
              !isActive && !isCompleted && "text-white/40",
              isClickable && "cursor-pointer hover:bg-white/5"
            )}
          >
            <span
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
                isActive && "border-[var(--neon-cyan)] text-[var(--neon-cyan)]",
                isCompleted && "border-[var(--neon-green)] bg-[var(--neon-green)]/20 text-[var(--neon-green)]",
                !isActive && !isCompleted && "border-white/20 text-white/40"
              )}
            >
              {isCompleted ? "\u2713" : i + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
