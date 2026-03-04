export type LocationZone = "Delhi" | "Gurgaon" | "Noida" | "Faridabad" | "Ghaziabad";

export type WorkMode = "remote" | "hybrid" | "office";

export type SourceType = "career_page" | "referral" | "linkedin" | "job_board";

export type SeniorityLevel = "intern" | "junior" | "mid" | "senior" | "lead" | "principal";

export type StackTag =
  | "React"
  | "Next.js"
  | "Node.js"
  | "TypeScript"
  | "Python"
  | "Django"
  | "FastAPI"
  | "Go"
  | "Rust"
  | "Java"
  | "Spring"
  | "AWS"
  | "GCP"
  | "Azure"
  | "Docker"
  | "Kubernetes"
  | "PostgreSQL"
  | "MongoDB"
  | "Redis"
  | "GraphQL"
  | "REST"
  | "TensorFlow"
  | "PyTorch"
  | "LLM"
  | "GenAI"
  | "Vue"
  | "Angular"
  | "Svelte"
  | "Flutter"
  | "React Native"
  | "Tailwind"
  | "SQL"
  | "Kafka"
  | "Elasticsearch";

export interface Job {
  id: string;
  title: string;
  company: string;
  locationZone: LocationZone;
  workMode: WorkMode;
  minExp: number;
  maxExp: number;
  salaryMinLPA: number;
  salaryMaxLPA: number;
  stackTags: StackTag[];
  jdText: string;
  sourceType: SourceType;
  postedAt: string; // ISO date string
  repostCount: number;
  verified: boolean;
  reports: number;
  companyLogo?: string;
  applyUrl?: string;
}

export interface TrustScoreBreakdown {
  freshness: number;
  sourceReliability: number;
  repostPenalty: number;
  reportsPenalty: number;
  verificationBonus: number;
  total: number;
}

export interface MatchScoreBreakdown {
  skillOverlap: number;
  seniorityFit: number;
  salaryFit: number;
  locationFit: number;
  total: number;
}

export interface UserProfile {
  name: string;
  email: string;
  skills: StackTag[];
  experienceYears: number;
  seniorityLevel: SeniorityLevel;
  preferredZones: LocationZone[];
  preferredWorkMode: WorkMode[];
  desiredSalaryMinLPA: number;
  desiredSalaryMaxLPA: number;
  resumeText: string;
}

export interface AnalyzerResult {
  missingKeywords: string[];
  skillGaps: string[];
  bulletRewrites: BulletRewrite[];
  salaryBenchmark: SalaryBenchmark;
  atsScore: number;
}

export interface BulletRewrite {
  original: string;
  improved: string;
  reason: string;
}

export interface SalaryBenchmark {
  role: string;
  zone: LocationZone;
  lowLPA: number;
  midLPA: number;
  highLPA: number;
  note: string;
}

export interface InterviewQuestion {
  id: number;
  category: "behavioral" | "technical" | "system_design" | "situational";
  question: string;
  hints: string[];
  evaluationCriteria: string[];
}

export interface InterviewFeedback {
  questionId: number;
  clarityScore: number; // 1-5
  starFormatScore: number; // 1-5
  techDepthScore: number; // 1-5
  overallScore: number; // 1-5
  feedback: string;
  suggestedAnswer: string;
  missingPoints: string[];
}

export interface InterviewSession {
  jobTitle: string;
  jdText: string;
  questions: InterviewQuestion[];
  answers: Record<number, string>;
  feedbacks: Record<number, InterviewFeedback>;
  currentStep: number;
  completedAt?: string;
}

export interface FilterState {
  stackTags: StackTag[];
  expLevel: SeniorityLevel | "";
  salaryMin: number;
  salaryMax: number;
  zones: LocationZone[];
  workModes: WorkMode[];
  trustScoreMin: number;
  sortBy: "trust_desc" | "match_desc" | "newest";
}
