# DelhiDevMatch

Hyper-local Delhi/NCR tech job matcher with trust scoring, resume analysis, and mock interview coaching.

## Features

- **Trust Score** (0-100) — Every job listing scored on freshness, source reliability, verification, reposts, and user reports.
- **Match Score** (0-100) — Personalized fit score based on your skills, experience, salary expectations, and location preferences.
- **Resume & JD Analyzer** — Compare your resume against any job description. Get ATS keyword gaps, skill analysis, bullet rewrite suggestions, and Delhi/NCR salary benchmarks.
- **Mock Interview Coach** — Practice with role-specific questions (behavioral, technical, system design, situational) and get instant feedback on clarity, STAR format, and technical depth.
- **Ghost Job Detection** — Listings with Trust Score < 40 are flagged with a warning banner.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + custom CSS (glass, neon glow, shimmer)
- **Animations**: Framer Motion 12
- **Validation**: Zod
- **Testing**: Vitest
- **UI Theme**: Cosmic Forest (neon palette + glassmorphism + starfield)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Run development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Theme, glass, shimmer, scrollbar styles
│   ├── api/health/         # Health check endpoint
│   └── app/                # Main app routes
│       ├── layout.tsx      # App layout (navbar, starfield, footer)
│       ├── page.tsx        # Dashboard
│       ├── jobs/           # Job explorer with filters
│       ├── analyzer/       # Resume/JD analyzer
│       └── interview/      # Mock interview coach
├── components/
│   ├── layout/             # Navbar, Footer, StarField
│   ├── shared/             # SectionHeading, Badge, ScorePill, ScoreRing, etc.
│   └── sections/           # Hero, JobCard, FiltersPanel, AnalyzerForm, etc.
├── lib/
│   ├── utils.ts            # Utility functions (cn, clamp, formatters)
│   ├── scoring/            # Trust & Match score engines
│   ├── analyzer/           # Resume/JD analysis logic
│   ├── interview/          # Question generation & answer evaluation
│   └── data/               # Seed data (25 jobs, mock user profile)
└── types/                  # TypeScript interfaces
```

## How Scoring Works

### Trust Score (0-100)

| Factor              | Points                                                      |
| ------------------- | ----------------------------------------------------------- |
| Freshness           | 0 days: +40, 1-7d: +30, 8-21d: +15, 22-60d: +5, 60+: +0  |
| Source Reliability   | career_page: +30, referral: +25, linkedin: +15, job_board: +10 |
| Repost Penalty       | -5 per repost (max -20)                                     |
| Reports Penalty      | -10 per report (max -40)                                     |
| Verification Bonus   | +10 if verified                                              |

### Match Score (0-100)

| Factor         | Weight | Calculation                                    |
| -------------- | ------ | ---------------------------------------------- |
| Skill Overlap  | 50%    | % of job skills present in user profile         |
| Seniority Fit  | 20%    | Experience years vs job's min/max range         |
| Salary Fit     | 15%    | Overlap between desired and offered salary      |
| Location Fit   | 15%    | Zone match + work mode preference               |

## Environment Variables

| Variable                       | Description                    | Default            |
| ------------------------------ | ------------------------------ | ------------------ |
| `NEXT_PUBLIC_APP_URL`          | Application URL                | http://localhost:3000 |
| `NEXT_PUBLIC_STARFIELD_ENABLED`| Enable starfield background    | true               |

## Scripts

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Production build
npm run start     # Start production server
npm run test      # Run tests
npm run test:watch # Run tests in watch mode
npm run lint      # Lint code
```

## Testing

```bash
# Run all scoring tests
npm test

# Watch mode
npm run test:watch
```

## Roadmap

- [ ] PDF resume upload & parsing
- [ ] Real job API integration (LinkedIn, Indeed, company career pages)
- [ ] AI-powered resume analysis (Claude/GPT integration)
- [ ] AI-powered interview feedback
- [ ] User authentication & saved preferences
- [ ] Job application tracking
- [ ] Bulk apply optimizer
- [ ] Email notifications for new matching jobs
- [ ] Company reviews & salary data from Glassdoor/AmbitionBox
- [ ] Mobile-optimized PWA

## License

MIT
