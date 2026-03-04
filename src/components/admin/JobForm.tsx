"use client";

import { useState } from "react";
import { useAdminToken } from "./AdminAuthGate";
import { Plus } from "lucide-react";

const ZONES = ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"] as const;
const WORK_MODES = ["remote", "hybrid", "office"] as const;
const SOURCE_TYPES = ["career_page", "referral", "linkedin", "job_board", "adzuna"] as const;

export function JobForm({ onCreated }: { onCreated: () => void }) {
  const { token } = useAdminToken();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    locationZone: "Delhi" as string,
    workMode: "office" as string,
    minExp: 0,
    maxExp: 3,
    salaryMinLPA: 5,
    salaryMaxLPA: 15,
    stackTags: "",
    jdText: "",
    sourceType: "job_board" as string,
    applyUrl: "",
    verified: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const tags = form.stackTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      ...form,
      stackTags: tags,
      minExp: Number(form.minExp),
      maxExp: Number(form.maxExp),
      salaryMinLPA: Number(form.salaryMinLPA),
      salaryMaxLPA: Number(form.salaryMaxLPA),
      applyUrl: form.applyUrl || undefined,
    };

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setForm({
          title: "", company: "", locationZone: "Delhi", workMode: "office",
          minExp: 0, maxExp: 3, salaryMinLPA: 5, salaryMaxLPA: 15,
          stackTags: "", jdText: "", sourceType: "job_board", applyUrl: "", verified: false,
        });
        setOpen(false);
        onCreated();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create job");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-green)]/20 border border-[var(--neon-green)]/30 text-[var(--neon-green)] text-sm font-medium hover:bg-[var(--neon-green)]/30 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Job
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-xl p-6 space-y-4 border border-white/10"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Add New Job</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-white/40 hover:text-white text-sm"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/40 mb-1">Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Company *</label>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[var(--neon-cyan)]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Zone</label>
          <select
            value={form.locationZone}
            onChange={(e) => setForm({ ...form, locationZone: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          >
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Work Mode</label>
          <select
            value={form.workMode}
            onChange={(e) => setForm({ ...form, workMode: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          >
            {WORK_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Min Exp (years)</label>
          <input
            type="number"
            min={0}
            value={form.minExp}
            onChange={(e) => setForm({ ...form, minExp: Number(e.target.value) })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Max Exp (years)</label>
          <input
            type="number"
            min={0}
            value={form.maxExp}
            onChange={(e) => setForm({ ...form, maxExp: Number(e.target.value) })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Min Salary (LPA)</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={form.salaryMinLPA}
            onChange={(e) => setForm({ ...form, salaryMinLPA: Number(e.target.value) })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Max Salary (LPA)</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={form.salaryMaxLPA}
            onChange={(e) => setForm({ ...form, salaryMaxLPA: Number(e.target.value) })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Source Type</label>
          <select
            value={form.sourceType}
            onChange={(e) => setForm({ ...form, sourceType: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          >
            {SOURCE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">Apply URL</label>
          <input
            type="url"
            value={form.applyUrl}
            onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1">
          Stack Tags (comma-separated) *
        </label>
        <input
          type="text"
          required
          value={form.stackTags}
          onChange={(e) => setForm({ ...form, stackTags: e.target.value })}
          placeholder="React, TypeScript, Node.js"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1">Job Description *</label>
        <textarea
          required
          rows={5}
          value={form.jdText}
          onChange={(e) => setForm({ ...form, jdText: e.target.value })}
          placeholder="Full job description (min 50 chars)..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none resize-y"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="verified"
          checked={form.verified}
          onChange={(e) => setForm({ ...form, verified: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="verified" className="text-sm text-white/60">Mark as verified</label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-green)]/80 text-black font-semibold text-sm disabled:opacity-40 hover:shadow-[0_0_20px_var(--neon-green)] transition-all"
      >
        {loading ? "Creating..." : "Create Job"}
      </button>
    </form>
  );
}
