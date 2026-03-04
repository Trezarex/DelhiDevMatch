import type { AnalyzerResult, BulletRewrite, SalaryBenchmark, LocationZone } from "@/types";

const COMMON_TECH_KEYWORDS = [
  "react", "next.js", "nextjs", "node.js", "nodejs", "typescript", "javascript",
  "python", "django", "fastapi", "flask", "go", "golang", "rust", "java", "spring",
  "aws", "gcp", "azure", "docker", "kubernetes", "k8s", "postgresql", "postgres",
  "mongodb", "redis", "graphql", "rest", "api", "microservices", "ci/cd", "git",
  "agile", "scrum", "tdd", "unit testing", "integration testing", "tailwind",
  "css", "html", "sql", "nosql", "kafka", "rabbitmq", "elasticsearch",
  "tensorflow", "pytorch", "machine learning", "deep learning", "llm",
  "genai", "rag", "prompt engineering", "data pipeline", "etl",
  "system design", "distributed systems", "scalability", "performance",
  "accessibility", "responsive", "mobile", "cross-platform",
];

const ACTION_VERBS = [
  "built", "designed", "implemented", "developed", "architected", "led",
  "optimized", "reduced", "increased", "improved", "delivered", "launched",
  "migrated", "automated", "streamlined", "mentored", "collaborated",
  "integrated", "deployed", "scaled",
];

const SALARY_BENCHMARKS: Record<string, Record<string, [number, number, number]>> = {
  frontend: {
    Delhi: [8, 18, 35],
    Gurgaon: [10, 22, 45],
    Noida: [7, 16, 30],
    Faridabad: [6, 14, 25],
    Ghaziabad: [6, 14, 25],
  },
  backend: {
    Delhi: [8, 20, 40],
    Gurgaon: [12, 25, 50],
    Noida: [8, 18, 35],
    Faridabad: [7, 15, 28],
    Ghaziabad: [7, 15, 28],
  },
  fullstack: {
    Delhi: [10, 22, 42],
    Gurgaon: [12, 28, 55],
    Noida: [9, 20, 38],
    Faridabad: [8, 16, 30],
    Ghaziabad: [8, 16, 30],
  },
  devops: {
    Delhi: [10, 22, 42],
    Gurgaon: [14, 28, 50],
    Noida: [10, 22, 38],
    Faridabad: [8, 18, 32],
    Ghaziabad: [8, 18, 32],
  },
  ai_ml: {
    Delhi: [12, 28, 55],
    Gurgaon: [15, 35, 65],
    Noida: [12, 25, 48],
    Faridabad: [10, 20, 38],
    Ghaziabad: [10, 20, 38],
  },
};

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return COMMON_TECH_KEYWORDS.filter((kw) => lower.includes(kw));
}

function findMissingKeywords(resumeText: string, jdText: string): string[] {
  const resumeKws = new Set(extractKeywords(resumeText));
  const jdKws = extractKeywords(jdText);
  return jdKws.filter((kw) => !resumeKws.has(kw));
}

function findSkillGaps(resumeText: string, jdText: string): string[] {
  const gaps: string[] = [];
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const skillPatterns = [
    { pattern: /\d+\+?\s*years?\s+(of\s+)?experience/i, label: "Years of experience emphasis" },
    { pattern: /distributed\s+systems?/i, label: "Distributed systems knowledge" },
    { pattern: /system\s+design/i, label: "System design experience" },
    { pattern: /lead|leadership|mentor/i, label: "Leadership/mentoring experience" },
    { pattern: /ci\/cd|continuous\s+(integration|deployment)/i, label: "CI/CD pipeline experience" },
    { pattern: /test|tdd|unit\s+test|integration\s+test/i, label: "Testing methodology" },
    { pattern: /agile|scrum|kanban/i, label: "Agile methodology" },
    { pattern: /performance|optimization|scalab/i, label: "Performance optimization" },
    { pattern: /security|auth|oauth|jwt/i, label: "Security practices" },
    { pattern: /monitoring|observability|logging/i, label: "Monitoring & observability" },
  ];

  for (const { pattern, label } of skillPatterns) {
    if (pattern.test(jdLower) && !pattern.test(resumeLower)) {
      gaps.push(label);
    }
  }

  return gaps.slice(0, 6);
}

function generateBulletRewrites(resumeText: string, jdText: string): BulletRewrite[] {
  const lines = resumeText.split("\n").filter((l) => l.trim().startsWith("-") || l.trim().startsWith("•"));
  const rewrites: BulletRewrite[] = [];

  for (const line of lines.slice(0, 5)) {
    const trimmed = line.replace(/^[-•]\s*/, "").trim();
    if (!trimmed || trimmed.length < 15) continue;

    const hasMetric = /\d+%|\d+x|\d+\+|\d+\s*(users|requests|transactions)/i.test(trimmed);
    const hasActionVerb = ACTION_VERBS.some((v) => trimmed.toLowerCase().startsWith(v));
    const jdKeywords = extractKeywords(jdText);
    const bulletKeywords = extractKeywords(trimmed);
    const missingFromBullet = jdKeywords.filter((k) => !bulletKeywords.includes(k)).slice(0, 2);

    if (hasMetric && hasActionVerb && missingFromBullet.length === 0) continue;

    let improved = trimmed;
    let reason = "";

    if (!hasActionVerb) {
      const verb = ACTION_VERBS[Math.floor(Math.random() * 5)];
      improved = `${verb.charAt(0).toUpperCase() + verb.slice(1)} ${improved.charAt(0).toLowerCase() + improved.slice(1)}`;
      reason += "Added strong action verb. ";
    }

    if (!hasMetric) {
      improved += ", resulting in measurable improvement in [metric]";
      reason += "Add quantifiable metrics. ";
    }

    if (missingFromBullet.length > 0) {
      reason += `Consider mentioning: ${missingFromBullet.join(", ")}. `;
    }

    if (reason) {
      rewrites.push({ original: trimmed, improved, reason: reason.trim() });
    }
  }

  return rewrites.slice(0, 5);
}

function detectRole(jdText: string): string {
  const lower = jdText.toLowerCase();
  if (lower.includes("machine learning") || lower.includes("ml ") || lower.includes("ai ") || lower.includes("llm")) return "ai_ml";
  if (lower.includes("devops") || lower.includes("sre") || lower.includes("platform engineer")) return "devops";
  if (lower.includes("full stack") || lower.includes("fullstack")) return "fullstack";
  if (lower.includes("backend") || lower.includes("server")) return "backend";
  return "frontend";
}

function getSalaryBenchmark(jdText: string, zone: LocationZone = "Gurgaon"): SalaryBenchmark {
  const role = detectRole(jdText);
  const benchmarks = SALARY_BENCHMARKS[role]?.[zone] ?? SALARY_BENCHMARKS.fullstack.Gurgaon;

  return {
    role: role.replace("_", "/").toUpperCase(),
    zone,
    lowLPA: benchmarks[0],
    midLPA: benchmarks[1],
    highLPA: benchmarks[2],
    note: `Based on Delhi/NCR ${zone} market data for ${role.replace("_", "/")} roles. Actual compensation varies by company stage, funding, and individual negotiation.`,
  };
}

function computeAtsScore(resumeText: string, jdText: string): number {
  const jdKeywords = extractKeywords(jdText);
  if (jdKeywords.length === 0) return 50;
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const matches = jdKeywords.filter((kw) => resumeKeywords.has(kw));
  return Math.round((matches.length / jdKeywords.length) * 100);
}

export function analyzeResumeJD(
  resumeText: string,
  jdText: string,
  zone: LocationZone = "Gurgaon"
): AnalyzerResult {
  return {
    missingKeywords: findMissingKeywords(resumeText, jdText),
    skillGaps: findSkillGaps(resumeText, jdText),
    bulletRewrites: generateBulletRewrites(resumeText, jdText),
    salaryBenchmark: getSalaryBenchmark(jdText, zone),
    atsScore: computeAtsScore(resumeText, jdText),
  };
}
