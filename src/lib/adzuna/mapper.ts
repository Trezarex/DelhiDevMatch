import type { AdzunaJob } from "./client";
import type { LocationZone, WorkMode, StackTag } from "@/types";

// --- Location mapping ---
const LOCATION_PATTERNS: [RegExp, LocationZone][] = [
  [/gurgaon|gurugram/i, "Gurgaon"],
  [/noida/i, "Noida"],
  [/faridabad/i, "Faridabad"],
  [/ghaziabad/i, "Ghaziabad"],
  [/delhi/i, "Delhi"],
];

export function extractLocation(job: AdzunaJob): LocationZone {
  const text = `${job.location.display_name} ${job.location.area.join(" ")}`;
  for (const [pattern, zone] of LOCATION_PATTERNS) {
    if (pattern.test(text)) return zone;
  }
  return "Delhi"; // Default for NCR
}

// --- Stack tag extraction ---
const STACK_PATTERNS: [RegExp, StackTag][] = [
  [/\breact\s*native\b/i, "React Native"],
  [/\bnext\.?js\b/i, "Next.js"],
  [/\bnode\.?js\b/i, "Node.js"],
  [/\breact\b/i, "React"],
  [/\btypescript\b|\bts\b/i, "TypeScript"],
  [/\bpython\b/i, "Python"],
  [/\bdjango\b/i, "Django"],
  [/\bfastapi\b/i, "FastAPI"],
  [/\bgo\b|\bgolang\b/i, "Go"],
  [/\brust\b/i, "Rust"],
  [/\bjava\b(?!\s*script)/i, "Java"],
  [/\bspring\b/i, "Spring"],
  [/\baws\b/i, "AWS"],
  [/\bgcp\b|\bgoogle\s*cloud\b/i, "GCP"],
  [/\bazure\b/i, "Azure"],
  [/\bdocker\b/i, "Docker"],
  [/\bkubernetes\b|\bk8s\b/i, "Kubernetes"],
  [/\bpostgres(?:ql)?\b/i, "PostgreSQL"],
  [/\bmongodb\b|\bmongo\b/i, "MongoDB"],
  [/\bredis\b/i, "Redis"],
  [/\bgraphql\b/i, "GraphQL"],
  [/\brest\s*(?:api|ful)?\b/i, "REST"],
  [/\btensorflow\b/i, "TensorFlow"],
  [/\bpytorch\b/i, "PyTorch"],
  [/\bllm\b|\blarge\s*language\b/i, "LLM"],
  [/\bgen\s*ai\b|\bgenerative\s*ai\b/i, "GenAI"],
  [/\bvue\b|\bvue\.?js\b/i, "Vue"],
  [/\bangular\b/i, "Angular"],
  [/\bsvelte\b/i, "Svelte"],
  [/\bflutter\b/i, "Flutter"],
  [/\btailwind\b/i, "Tailwind"],
  [/\bsql\b/i, "SQL"],
  [/\bkafka\b/i, "Kafka"],
  [/\belasticsearch\b|\belastic\b/i, "Elasticsearch"],
];

export function extractStackTags(job: AdzunaJob): StackTag[] {
  const text = `${job.title} ${job.description}`;
  const tags = new Set<StackTag>();

  for (const [pattern, tag] of STACK_PATTERNS) {
    if (pattern.test(text)) {
      tags.add(tag);
    }
  }

  return Array.from(tags);
}

// --- Work mode extraction ---
export function extractWorkMode(job: AdzunaJob): WorkMode {
  const text = `${job.title} ${job.description}`.toLowerCase();

  if (/\bremote\b|\bwork\s*from\s*home\b|\bwfh\b/.test(text)) return "remote";
  if (/\bhybrid\b/.test(text)) return "hybrid";
  return "office";
}

// --- Experience extraction ---
export function extractExperience(job: AdzunaJob): { minExp: number; maxExp: number } {
  const text = `${job.title} ${job.description}`;

  // Patterns like "3-7 years", "3 to 7 years", "3+ years"
  const rangeMatch = text.match(/(\d{1,2})\s*[-–to]+\s*(\d{1,2})\s*(?:\+?\s*)?(?:years?|yrs?)/i);
  if (rangeMatch) {
    return { minExp: parseInt(rangeMatch[1]), maxExp: parseInt(rangeMatch[2]) };
  }

  const plusMatch = text.match(/(\d{1,2})\+?\s*(?:years?|yrs?)/i);
  if (plusMatch) {
    const years = parseInt(plusMatch[1]);
    return { minExp: years, maxExp: years + 3 };
  }

  // Title-based heuristics
  const titleLower = job.title.toLowerCase();
  if (/\bintern\b/.test(titleLower)) return { minExp: 0, maxExp: 1 };
  if (/\bjunior\b|\bentry\b/.test(titleLower)) return { minExp: 0, maxExp: 2 };
  if (/\bsenior\b|\bsr\.?\b/.test(titleLower)) return { minExp: 5, maxExp: 10 };
  if (/\blead\b|\bprincipal\b|\bstaff\b/.test(titleLower)) return { minExp: 7, maxExp: 15 };

  return { minExp: 2, maxExp: 5 }; // Default mid-level
}

// --- Salary conversion (INR to LPA) ---
export function extractSalaryLPA(
  salaryMin: number,
  salaryMax: number
): { salaryMinLPA: number; salaryMaxLPA: number } {
  // Adzuna returns annual salary in INR
  // Convert to LPA (lakhs per annum = ÷ 100,000)
  const minLPA = Math.round((salaryMin / 100000) * 10) / 10;
  const maxLPA = Math.round((salaryMax / 100000) * 10) / 10;

  // Reasonable defaults if salary data is missing or weird
  if (minLPA <= 0 && maxLPA <= 0) {
    return { salaryMinLPA: 6, salaryMaxLPA: 15 };
  }

  return {
    salaryMinLPA: Math.max(minLPA, 1),
    salaryMaxLPA: Math.max(maxLPA, minLPA + 2),
  };
}

// --- Full mapper ---
export interface MappedAdzunaJob {
  adzunaId: string;
  title: string;
  company: string;
  locationZone: string;
  workMode: string;
  minExp: number;
  maxExp: number;
  salaryMinLPA: number;
  salaryMaxLPA: number;
  stackTags: string; // JSON stringified
  jdText: string;
  sourceType: string;
  postedAt: Date;
  applyUrl: string;
  source: string;
}

export function mapAdzunaJob(job: AdzunaJob): MappedAdzunaJob | null {
  const stackTags = extractStackTags(job);

  // Skip jobs with no recognized tech stack
  if (stackTags.length === 0) return null;

  const { minExp, maxExp } = extractExperience(job);
  const { salaryMinLPA, salaryMaxLPA } = extractSalaryLPA(job.salary_min, job.salary_max);

  return {
    adzunaId: job.id,
    title: job.title,
    company: job.company.display_name,
    locationZone: extractLocation(job),
    workMode: extractWorkMode(job),
    minExp,
    maxExp,
    salaryMinLPA,
    salaryMaxLPA,
    stackTags: JSON.stringify(stackTags),
    jdText: job.description.slice(0, 5000),
    sourceType: "adzuna",
    postedAt: new Date(job.created),
    applyUrl: job.redirect_url,
    source: "adzuna",
  };
}
