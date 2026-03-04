import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function daysSince(dateString: string): number {
  const now = new Date();
  const then = new Date(dateString);
  const diff = now.getTime() - then.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatSalary(lpa: number): string {
  if (lpa >= 100) return `${(lpa / 100).toFixed(1)}Cr`;
  return `${lpa}L`;
}

export function formatDate(dateString: string): string {
  const days = daysSince(dateString);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "var(--neon-green)";
  if (score >= 60) return "var(--neon-cyan)";
  if (score >= 40) return "var(--neon-gold)";
  return "var(--neon-magenta)";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Low";
}
