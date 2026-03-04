import type { UserProfile } from "@/types";

export const defaultUserProfile: UserProfile = {
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Tailwind",
    "PostgreSQL",
    "Docker",
    "AWS",
    "GraphQL",
    "REST",
  ],
  experienceYears: 4,
  seniorityLevel: "mid",
  preferredZones: ["Gurgaon", "Delhi"],
  preferredWorkMode: ["hybrid", "remote"],
  desiredSalaryMinLPA: 20,
  desiredSalaryMaxLPA: 40,
  resumeText: `Aarav Sharma
Senior Frontend Developer | 4 Years Experience

SUMMARY
Results-driven frontend developer with 4 years of experience building performant web applications using React, Next.js, and TypeScript. Passionate about creating accessible, user-centric interfaces.

EXPERIENCE
Frontend Developer — TechCorp India, Gurgaon (2022-Present)
- Built a customer dashboard using React and Next.js, improving page load times by 40%
- Implemented component library with 50+ reusable components using Tailwind CSS
- Led migration from JavaScript to TypeScript across 3 projects
- Integrated GraphQL APIs for real-time data fetching

Junior Developer — WebStudio, Delhi (2020-2022)
- Developed responsive websites using React and Node.js
- Built REST APIs with Express.js and PostgreSQL
- Deployed applications on AWS using Docker containers
- Collaborated with design team on UI/UX improvements

SKILLS
Languages: TypeScript, JavaScript, HTML, CSS, SQL
Frontend: React, Next.js, Tailwind CSS, Framer Motion
Backend: Node.js, Express.js, GraphQL, REST
Databases: PostgreSQL, MongoDB, Redis
Cloud: AWS (EC2, S3, RDS), Docker
Tools: Git, VS Code, Figma, Jira

EDUCATION
B.Tech Computer Science — Delhi Technological University (2020)`,
};
