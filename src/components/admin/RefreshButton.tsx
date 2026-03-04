"use client";

import { useState } from "react";
import { useAdminToken } from "./AdminAuthGate";
import { RefreshCw } from "lucide-react";

interface RefreshResult {
  jobsFetched: number;
  jobsAdded: number;
  jobsSkipped: number;
  error?: string;
}

export function RefreshButton({ onRefreshed }: { onRefreshed: () => void }) {
  const { token } = useAdminToken();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RefreshResult | null>(null);

  const handleRefresh = async () => {
    if (!token) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/jobs/refresh", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: RefreshResult = await res.json();
      setResult(data);

      if (!data.error) {
        onRefreshed();
      }
    } catch {
      setResult({ jobsFetched: 0, jobsAdded: 0, jobsSkipped: 0, error: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-purple)]/20 border border-[var(--neon-purple)]/30 text-[var(--neon-purple)] text-sm font-medium hover:bg-[var(--neon-purple)]/30 transition-colors disabled:opacity-40"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Fetching..." : "Refresh from Adzuna"}
      </button>
      {result && (
        <span className={`text-xs ${result.error ? "text-red-400" : "text-[var(--neon-green)]"}`}>
          {result.error
            ? `Error: ${result.error}`
            : `+${result.jobsAdded} new, ${result.jobsSkipped} skipped (${result.jobsFetched} fetched)`}
        </span>
      )}
    </div>
  );
}
