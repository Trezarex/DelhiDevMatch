"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminToken } from "@/components/admin/AdminAuthGate";
import { JobsTable } from "@/components/admin/JobsTable";
import { JobForm } from "@/components/admin/JobForm";
import { RefreshButton } from "@/components/admin/RefreshButton";
import { LogOut, Database } from "lucide-react";

export function AdminDashboard() {
  const { token, clearToken } = useAdminToken();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-[var(--neon-cyan)]" />
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <span className="text-xs text-white/30 bg-white/5 rounded-full px-3 py-1">
            {jobs.length} jobs
          </span>
        </div>
        <button
          onClick={clearToken}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <JobForm onCreated={fetchJobs} />
        <RefreshButton onRefreshed={fetchJobs} />
      </div>

      {/* Jobs Table */}
      {loading ? (
        <div className="text-center py-16 text-white/30">Loading jobs...</div>
      ) : (
        <JobsTable jobs={jobs} onJobsChanged={fetchJobs} />
      )}
    </div>
  );
}
