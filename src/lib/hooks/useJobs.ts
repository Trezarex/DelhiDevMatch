"use client";

import { useEffect, useState } from "react";
import type { Job } from "@/types";
import { seedJobs } from "@/lib/data/jobs.seed";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data: Job[]) => {
        if (!cancelled && data.length > 0) {
          setJobs(data);
        }
      })
      .catch(() => {
        // Keep seed data as fallback — no blank screen
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { jobs, loading };
}
