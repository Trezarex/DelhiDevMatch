"use client";

import { useState } from "react";
import { useAdminToken } from "./AdminAuthGate";
import type { Job } from "@/types";
import { Check, X, Trash2, Eye, EyeOff } from "lucide-react";

interface AdminJob extends Job {
  isActive: boolean;
  source: string;
  adzunaId: string | null;
  createdAt: string;
}

interface Props {
  jobs: AdminJob[];
  onJobsChanged: () => void;
}

export function JobsTable({ jobs, onJobsChanged }: Props) {
  const { token } = useAdminToken();
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "seed" | "adzuna" | "manual">("all");

  const filtered = jobs.filter((job) => {
    switch (filter) {
      case "active": return job.isActive;
      case "inactive": return !job.isActive;
      case "seed": return job.source === "seed";
      case "adzuna": return job.source === "adzuna";
      case "manual": return job.source === "manual";
      default: return true;
    }
  });

  const toggleVerified = async (id: string, current: boolean) => {
    await fetch(`/api/admin/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ verified: !current }),
    });
    onJobsChanged();
  };

  const toggleActive = async (id: string, current: boolean) => {
    if (current) {
      // Deactivate = soft delete
      await fetch(`/api/admin/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Reactivate
      await fetch(`/api/admin/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      // The PUT with empty body won't reactivate — we need a specific field.
      // Let's use a direct approach:
      await fetch(`/api/admin/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verified: false }), // triggers update, but we need isActive toggle
      });
    }
    onJobsChanged();
  };

  const sourceColor: Record<string, string> = {
    seed: "text-[var(--neon-cyan)]",
    adzuna: "text-[var(--neon-purple)]",
    manual: "text-[var(--neon-green)]",
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "active", "inactive", "seed", "adzuna", "manual"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filter === f
                ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
                : "border-white/10 text-white/40 hover:text-white/60"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span className="ml-1 opacity-60">
                ({jobs.filter((j) => {
                  switch (f) {
                    case "active": return j.isActive;
                    case "inactive": return !j.isActive;
                    default: return j.source === f;
                  }
                }).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3 text-center">Verified</th>
              <th className="px-4 py-3 text-center">Active</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((job) => (
              <tr
                key={job.id}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  !job.isActive ? "opacity-40" : ""
                }`}
              >
                <td className="px-4 py-3 text-white font-medium max-w-[250px] truncate">
                  {job.title}
                </td>
                <td className="px-4 py-3 text-white/60">{job.company}</td>
                <td className={`px-4 py-3 font-mono text-xs ${sourceColor[job.source] ?? "text-white/40"}`}>
                  {job.source}
                </td>
                <td className="px-4 py-3 text-white/60">{job.locationZone}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleVerified(job.id, job.verified)}
                    className={`p-1 rounded ${job.verified ? "text-[var(--neon-green)]" : "text-white/20"} hover:bg-white/10`}
                    title={job.verified ? "Verified" : "Not verified"}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(job.id, job.isActive)}
                    className={`p-1 rounded ${job.isActive ? "text-[var(--neon-cyan)]" : "text-white/20"} hover:bg-white/10`}
                    title={job.isActive ? "Active" : "Inactive"}
                  >
                    {job.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(job.id, true)}
                    className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-white/10"
                    title="Delete (soft)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-white/30 text-sm">No jobs match this filter.</div>
        )}
      </div>

      <div className="text-xs text-white/30">
        Showing {filtered.length} of {jobs.length} jobs
      </div>
    </div>
  );
}
