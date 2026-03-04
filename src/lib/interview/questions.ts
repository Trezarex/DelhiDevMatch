import type { InterviewQuestion, InterviewFeedback } from "@/types";

const BEHAVIORAL_TEMPLATES: Omit<InterviewQuestion, "id">[] = [
  {
    category: "behavioral",
    question: "Tell me about a time you had to deal with a tight deadline on a project. How did you handle it?",
    hints: ["Use STAR format", "Mention prioritization", "Show outcome"],
    evaluationCriteria: ["Clear situation/context", "Specific actions taken", "Quantifiable result", "Lessons learned"],
  },
  {
    category: "behavioral",
    question: "Describe a situation where you disagreed with a team member on a technical decision. How did you resolve it?",
    hints: ["Focus on collaboration", "Show empathy", "Explain the resolution"],
    evaluationCriteria: ["Professional communication", "Willingness to compromise", "Data-driven decision", "Positive outcome"],
  },
  {
    category: "behavioral",
    question: "Tell me about a bug you shipped to production. How did you handle the situation?",
    hints: ["Be honest about the mistake", "Focus on the fix", "Mention prevention measures"],
    evaluationCriteria: ["Ownership of mistake", "Quick response", "Root cause analysis", "Prevention strategy"],
  },
];

const TECHNICAL_TEMPLATES: Record<string, Omit<InterviewQuestion, "id">[]> = {
  frontend: [
    {
      category: "technical",
      question: "Explain how React's reconciliation algorithm works. How does the virtual DOM improve performance?",
      hints: ["Mention fiber architecture", "Discuss diffing algorithm", "Talk about batching"],
      evaluationCriteria: ["Understanding of virtual DOM", "Fiber architecture knowledge", "Performance implications", "Practical examples"],
    },
    {
      category: "technical",
      question: "How would you optimize a React application that has slow rendering performance?",
      hints: ["React.memo, useMemo, useCallback", "Code splitting", "Profiler tool"],
      evaluationCriteria: ["Profiling approach", "Memoization strategy", "Bundle optimization", "Rendering patterns"],
    },
    {
      category: "technical",
      question: "What is the difference between Server Components and Client Components in Next.js? When would you use each?",
      hints: ["Data fetching patterns", "Bundle size impact", "Interactivity needs"],
      evaluationCriteria: ["RSC understanding", "Correct use cases", "Performance benefits", "Hydration knowledge"],
    },
  ],
  backend: [
    {
      category: "technical",
      question: "How would you design an API rate limiter? What algorithms would you consider?",
      hints: ["Token bucket", "Sliding window", "Distributed considerations"],
      evaluationCriteria: ["Algorithm knowledge", "Distributed systems awareness", "Trade-offs discussion", "Implementation clarity"],
    },
    {
      category: "technical",
      question: "Explain database indexing strategies. When would you use a composite index vs separate indexes?",
      hints: ["B-tree structure", "Query patterns", "Write overhead"],
      evaluationCriteria: ["Index types knowledge", "Query optimization", "Trade-offs", "Practical experience"],
    },
    {
      category: "technical",
      question: "How do you handle database migrations in a zero-downtime deployment?",
      hints: ["Backward compatibility", "Blue-green deployment", "Feature flags"],
      evaluationCriteria: ["Migration strategies", "Rollback plans", "Testing approach", "Real-world experience"],
    },
  ],
  general: [
    {
      category: "technical",
      question: "What is your approach to writing clean, maintainable code? Give specific examples from your experience.",
      hints: ["SOLID principles", "Code reviews", "Documentation"],
      evaluationCriteria: ["Coding principles", "Practical examples", "Team collaboration", "Continuous improvement"],
    },
    {
      category: "technical",
      question: "How do you approach debugging a complex issue in production?",
      hints: ["Logging strategy", "Reproduction steps", "Root cause analysis"],
      evaluationCriteria: ["Systematic approach", "Tools usage", "Communication during incidents", "Post-mortem process"],
    },
  ],
};

const SYSTEM_DESIGN_TEMPLATES: Omit<InterviewQuestion, "id">[] = [
  {
    category: "system_design",
    question: "Design a real-time notification system for a food delivery app like Zomato/Swiggy.",
    hints: ["WebSocket vs SSE vs polling", "Message queue", "Push notifications", "Scalability"],
    evaluationCriteria: ["Architecture clarity", "Technology choices", "Scalability considerations", "Failure handling"],
  },
  {
    category: "system_design",
    question: "How would you design a URL shortener service that handles 10 million URLs per day?",
    hints: ["Hashing strategy", "Database choice", "Caching layer", "Analytics"],
    evaluationCriteria: ["Scale estimation", "Database design", "Caching strategy", "API design"],
  },
];

const SITUATIONAL_TEMPLATES: Omit<InterviewQuestion, "id">[] = [
  {
    category: "situational",
    question: "Your team is asked to deliver a feature in 2 weeks that you estimate will take 4 weeks. What do you do?",
    hints: ["Scope negotiation", "MVP approach", "Risk communication"],
    evaluationCriteria: ["Honest communication", "Scope management", "Alternative proposals", "Stakeholder management"],
  },
  {
    category: "situational",
    question: "You discover that a senior engineer's code has a security vulnerability. How do you handle it?",
    hints: ["Private communication", "Severity assessment", "Fix timeline"],
    evaluationCriteria: ["Professional approach", "Security awareness", "Tactful communication", "Resolution focus"],
  },
];

function detectDomain(jdText: string): "frontend" | "backend" | "general" {
  const lower = jdText.toLowerCase();
  const frontendSignals = ["react", "frontend", "front-end", "ui", "css", "next.js", "vue", "angular"];
  const backendSignals = ["backend", "back-end", "api", "database", "server", "microservice", "node.js", "python", "java", "go"];

  const feScore = frontendSignals.filter((s) => lower.includes(s)).length;
  const beScore = backendSignals.filter((s) => lower.includes(s)).length;

  if (feScore > beScore) return "frontend";
  if (beScore > feScore) return "backend";
  return "general";
}

export function generateQuestions(jdText: string): InterviewQuestion[] {
  const domain = detectDomain(jdText);
  const techQuestions = TECHNICAL_TEMPLATES[domain] ?? TECHNICAL_TEMPLATES.general;

  const pool = [
    ...BEHAVIORAL_TEMPLATES.slice(0, 3),
    ...techQuestions.slice(0, 3),
    ...SYSTEM_DESIGN_TEMPLATES.slice(0, 2),
    ...SITUATIONAL_TEMPLATES.slice(0, 2),
  ];

  return pool.slice(0, 10).map((q, i) => ({ ...q, id: i + 1 }));
}

export function evaluateAnswer(
  question: InterviewQuestion,
  answer: string
): InterviewFeedback {
  const trimmed = answer.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const sentences = trimmed.split(/[.!?]+/).filter(Boolean);

  // Clarity score based on length and structure
  let clarityScore = 3;
  if (wordCount >= 50 && wordCount <= 300) clarityScore = 4;
  if (wordCount >= 80 && wordCount <= 250 && sentences.length >= 3) clarityScore = 5;
  if (wordCount < 20) clarityScore = 2;
  if (wordCount < 10) clarityScore = 1;

  // STAR format detection
  let starScore = 2;
  const hasContext = /situation|context|when|project|team|company/i.test(trimmed);
  const hasTask = /task|goal|objective|responsible|needed to|had to/i.test(trimmed);
  const hasAction = /i\s+(did|built|created|implemented|designed|led|wrote|fixed|optimized)/i.test(trimmed);
  const hasResult = /result|outcome|improved|reduced|increased|achieved|led to|saved/i.test(trimmed);

  const starParts = [hasContext, hasTask, hasAction, hasResult].filter(Boolean).length;
  if (question.category === "behavioral" || question.category === "situational") {
    starScore = Math.min(5, starParts + 1);
  } else {
    starScore = Math.min(5, Math.max(3, starParts + 1));
  }

  // Tech depth score
  let techDepthScore = 3;
  const techTerms = [
    "algorithm", "complexity", "cache", "index", "latency", "throughput",
    "scalab", "distributed", "consistency", "availability", "partition",
    "thread", "async", "concurrent", "memory", "cpu", "network",
    "api", "database", "query", "schema", "architecture",
    "component", "render", "state", "hook", "virtual dom",
  ];
  const techMentions = techTerms.filter((t) => trimmed.toLowerCase().includes(t)).length;
  if (techMentions >= 5) techDepthScore = 5;
  else if (techMentions >= 3) techDepthScore = 4;
  else if (techMentions >= 1) techDepthScore = 3;
  else techDepthScore = 2;

  if (question.category === "behavioral") {
    techDepthScore = Math.max(techDepthScore, 3); // Less important for behavioral
  }

  const overallScore = Math.round((clarityScore + starScore + techDepthScore) / 3);

  // Generate feedback
  const feedbackParts: string[] = [];
  const missingPoints: string[] = [];

  if (clarityScore < 4) {
    feedbackParts.push("Your answer could be more structured. Try to organize your thoughts into clear paragraphs.");
  }
  if (starScore < 4 && (question.category === "behavioral" || question.category === "situational")) {
    feedbackParts.push("Use the STAR format: Situation, Task, Action, Result. This makes your answer more compelling.");
    if (!hasContext) missingPoints.push("Set the scene — describe the situation/context");
    if (!hasTask) missingPoints.push("Clarify the specific task or challenge");
    if (!hasAction) missingPoints.push("Detail the specific actions YOU took");
    if (!hasResult) missingPoints.push("Quantify the results/outcome");
  }
  if (techDepthScore < 4 && (question.category === "technical" || question.category === "system_design")) {
    feedbackParts.push("Add more technical depth. Mention specific technologies, patterns, or metrics.");
    missingPoints.push(...question.evaluationCriteria.slice(0, 2));
  }
  if (wordCount < 30) {
    feedbackParts.push("Your answer is too brief. Elaborate with specific examples and details.");
  }

  if (feedbackParts.length === 0) {
    feedbackParts.push("Good answer! You covered the key points well. Consider adding more specific metrics or examples to make it even stronger.");
  }

  // Generate suggested answer
  const suggestedAnswer = generateSuggestedAnswer(question);

  return {
    questionId: question.id,
    clarityScore,
    starFormatScore: starScore,
    techDepthScore,
    overallScore,
    feedback: feedbackParts.join(" "),
    suggestedAnswer,
    missingPoints,
  };
}

function generateSuggestedAnswer(question: InterviewQuestion): string {
  const templates: Record<string, string> = {
    behavioral: `A strong answer would follow the STAR format:\n\n**Situation**: Describe the specific context (team size, project, timeline).\n**Task**: What was your specific responsibility or challenge?\n**Action**: Detail 2-3 specific steps YOU took (not the team).\n**Result**: Quantify the outcome (%, time saved, revenue impact).\n\nKey criteria: ${question.evaluationCriteria.join(", ")}.`,
    technical: `A strong answer would:\n\n1. Start with a clear, concise explanation of the core concept\n2. Discuss trade-offs and alternatives\n3. Give a practical example from your experience\n4. Mention edge cases or gotchas\n\nKey areas to cover: ${question.evaluationCriteria.join(", ")}.`,
    system_design: `A strong answer would:\n\n1. Clarify requirements and constraints (scale, latency, availability)\n2. Start with a high-level architecture\n3. Deep dive into 2-3 key components\n4. Discuss trade-offs (CAP theorem, consistency vs availability)\n5. Address scalability and failure scenarios\n\nKey criteria: ${question.evaluationCriteria.join(", ")}.`,
    situational: `A strong answer would:\n\n1. Acknowledge the challenge honestly\n2. Show empathy and emotional intelligence\n3. Propose a specific, actionable plan\n4. Demonstrate leadership and communication skills\n\nKey criteria: ${question.evaluationCriteria.join(", ")}.`,
  };

  return templates[question.category] ?? templates.technical;
}
