"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Badge } from "@/components/shared/Badge";
import { defaultUserProfile } from "@/lib/data/userProfile";
import type { UserProfile, StackTag, LocationZone, WorkMode, SeniorityLevel } from "@/types";
import { User, Save, CheckCircle } from "lucide-react";

const STORAGE_KEY = "ddm_user_profile";

const ALL_SKILLS: StackTag[] = [
  "React", "Next.js", "Node.js", "TypeScript", "Python", "Django", "FastAPI",
  "Go", "Rust", "Java", "Spring", "AWS", "GCP", "Azure", "Docker",
  "Kubernetes", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST",
  "TensorFlow", "PyTorch", "LLM", "GenAI", "Vue", "Angular", "Tailwind",
  "SQL", "Kafka", "Elasticsearch",
];

const ZONES: LocationZone[] = ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"];
const WORK_MODES: WorkMode[] = ["remote", "hybrid", "office"];
const SENIORITY_LEVELS: SeniorityLevel[] = ["intern", "junior", "mid", "senior", "lead", "principal"];

export function useUserProfile(): [UserProfile, (p: UserProfile) => void] {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch { /* use default */ }
    }
  }, []);

  const saveProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  };

  return [profile, saveProfile];
}

interface ProfilePanelProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export function ProfilePanel({ profile, onSave }: ProfilePanelProps) {
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSkill = (skill: StackTag) => {
    const skills = draft.skills.includes(skill)
      ? draft.skills.filter((s) => s !== skill)
      : [...draft.skills, skill];
    setDraft({ ...draft, skills });
  };

  const toggleZone = (zone: LocationZone) => {
    const zones = draft.preferredZones.includes(zone)
      ? draft.preferredZones.filter((z) => z !== zone)
      : [...draft.preferredZones, zone];
    setDraft({ ...draft, preferredZones: zones });
  };

  const toggleWorkMode = (mode: WorkMode) => {
    const modes = draft.preferredWorkMode.includes(mode)
      ? draft.preferredWorkMode.filter((m) => m !== mode)
      : [...draft.preferredWorkMode, mode];
    setDraft({ ...draft, preferredWorkMode: modes });
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-[var(--neon-cyan)]" />
        <h3 className="text-lg font-semibold text-white">Your Profile</h3>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Name</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Email</label>
            <input
              type="email"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Years of Experience</label>
            <input
              type="number"
              min={0}
              max={30}
              value={draft.experienceYears}
              onChange={(e) => setDraft({ ...draft, experienceYears: Number(e.target.value) })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Seniority Level</label>
            <select
              value={draft.seniorityLevel}
              onChange={(e) => setDraft({ ...draft, seniorityLevel: e.target.value as SeniorityLevel })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
            >
              {SENIORITY_LEVELS.map((l) => (
                <option key={l} value={l} className="bg-[var(--night-900)]">{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1">Desired Min Salary (LPA)</label>
            <input
              type="number"
              min={0}
              value={draft.desiredSalaryMinLPA}
              onChange={(e) => setDraft({ ...draft, desiredSalaryMinLPA: Number(e.target.value) })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1">Desired Max Salary (LPA)</label>
            <input
              type="number"
              min={0}
              value={draft.desiredSalaryMaxLPA}
              onChange={(e) => setDraft({ ...draft, desiredSalaryMaxLPA: Number(e.target.value) })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs text-white/40 mb-2">Skills (click to toggle)</label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_SKILLS.map((skill) => (
              <Badge
                key={skill}
                variant="cyan"
                active={draft.skills.includes(skill)}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Preferred Zones */}
        <div>
          <label className="block text-xs text-white/40 mb-2">Preferred Locations</label>
          <div className="flex flex-wrap gap-1.5">
            {ZONES.map((zone) => (
              <Badge
                key={zone}
                variant="purple"
                active={draft.preferredZones.includes(zone)}
                onClick={() => toggleZone(zone)}
              >
                {zone}
              </Badge>
            ))}
          </div>
        </div>

        {/* Work Mode */}
        <div>
          <label className="block text-xs text-white/40 mb-2">Preferred Work Mode</label>
          <div className="flex flex-wrap gap-1.5">
            {WORK_MODES.map((mode) => (
              <Badge
                key={mode}
                variant="green"
                active={draft.preferredWorkMode.includes(mode)}
                onClick={() => toggleWorkMode(mode)}
              >
                {mode}
              </Badge>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-cyan)]/80 text-black font-semibold text-sm hover:shadow-[0_0_20px_var(--neon-cyan)] transition-all"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
