"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AnalyzerForm } from "@/components/sections/AnalyzerForm";
import { AnalyzerResults } from "@/components/sections/AnalyzerResults";
import { analyzeResumeJD } from "@/lib/analyzer/analyze";
import type { AnalyzerResult, LocationZone } from "@/types";

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const initialJd = searchParams.get("jd") ?? "";
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAnalyze(resumeText: string, jdText: string, zone: LocationZone) {
    setLoading(true);
    setTimeout(() => {
      const analysis = analyzeResumeJD(resumeText, jdText, zone);
      setResult(analysis);
      setLoading(false);
    }, 800);
  }

  return (
    <>
      <AnalyzerForm
        initialJd={initialJd}
        onAnalyze={handleAnalyze}
        loading={loading}
      />
      {result && <AnalyzerResults result={result} />}
    </>
  );
}

export default function AnalyzerPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Resume & JD Analyzer"
        subtitle="Compare your resume against any job description. Get ATS keyword gaps, skill analysis, and bullet rewrite suggestions."
        align="left"
      />
      <Suspense fallback={<div className="text-center text-white/30 py-8">Loading...</div>}>
        <AnalyzerContent />
      </Suspense>
    </div>
  );
}
