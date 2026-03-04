"use client";

import { cn } from "@/lib/utils";

interface TextareaWithCounterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  label?: string;
  className?: string;
}

export function TextareaWithCounter({
  value,
  onChange,
  placeholder,
  maxLength = 5000,
  rows = 8,
  label,
  className,
}: TextareaWithCounterProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[var(--neon-cyan)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--neon-cyan)]/30 transition-colors resize-y custom-scrollbar"
        />
        <div className="absolute bottom-2 right-3 text-xs text-white/30">
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}
