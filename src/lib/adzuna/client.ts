export interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  company: { display_name: string };
  location: { display_name: string; area: string[] };
  salary_min: number;
  salary_max: number;
  created: string; // ISO date
  redirect_url: string;
  category: { label: string; tag: string };
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
}

const ADZUNA_BASE = "https://api.adzuna.com/v1/api/jobs/in/search";

const SEARCH_KEYWORDS = [
  "software engineer delhi",
  "frontend developer gurgaon",
  "backend developer noida",
  "fullstack developer delhi ncr",
  "devops engineer delhi",
  "data engineer gurgaon noida",
];

export async function fetchAdzunaJobs(): Promise<AdzunaJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("ADZUNA_APP_ID and ADZUNA_APP_KEY must be set");
  }

  const allJobs: AdzunaJob[] = [];
  const seenIds = new Set<string>();

  for (const keyword of SEARCH_KEYWORDS) {
    const url = new URL(`${ADZUNA_BASE}/1`);
    url.searchParams.set("app_id", appId);
    url.searchParams.set("app_key", appKey);
    url.searchParams.set("what", keyword);
    url.searchParams.set("where", "delhi");
    url.searchParams.set("results_per_page", "20");
    url.searchParams.set("content-type", "application/json");

    const res = await fetch(url.toString());
    if (!res.ok) {
      console.warn(`Adzuna fetch failed for "${keyword}": ${res.status}`);
      continue;
    }

    const data: AdzunaResponse = await res.json();
    for (const job of data.results) {
      const id = String(job.id);
      if (!seenIds.has(id)) {
        seenIds.add(id);
        allJobs.push({ ...job, id });
      }
    }
  }

  return allJobs;
}
