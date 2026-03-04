"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { StepTabs } from "@/components/shared/StepTabs";
import { TextareaWithCounter } from "@/components/shared/TextareaWithCounter";
import { Badge } from "@/components/shared/Badge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { generateQuestions, evaluateAnswer } from "@/lib/interview/questions";
import type { InterviewQuestion, InterviewFeedback, InterviewSession } from "@/types";
import {
  MessageSquare, Send, Lightbulb, ChevronRight, RotateCcw, CheckCircle,
  AlertCircle, Star,
} from "lucide-react";

interface InterviewCoachProps {
  jdText: string;
  jobTitle?: string;
}

const STORAGE_KEY = "ddm_interview_session";

const categoryColors = {
  behavioral: "cyan" as const,
  technical: "magenta" as const,
  system_design: "purple" as const,
  situational: "gold" as const,
};

function RatingStars({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i < score ? "var(--neon-gold)" : "transparent"}
          stroke={i < score ? "var(--neon-gold)" : "rgba(255,255,255,0.2)"}
        />
      ))}
    </div>
  );
}

export function InterviewCoach({ jdText, jobTitle }: InterviewCoachProps) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.jdText === jdText) {
          setSession(parsed);
          return;
        }
      } catch { /* ignore */ }
    }
    startNewSession();
  }, [jdText]);

  // Save to localStorage on change
  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session]);

  function startNewSession() {
    const questions = generateQuestions(jdText);
    const newSession: InterviewSession = {
      jobTitle: jobTitle ?? "Custom Role",
      jdText,
      questions,
      answers: {},
      feedbacks: {},
      currentStep: 0,
    };
    setSession(newSession);
    setCurrentAnswer("");
    setShowHints(false);
  }

  function handleSubmitAnswer() {
    if (!session || !currentAnswer.trim()) return;

    setSubmitting(true);
    const question = session.questions[session.currentStep];

    // Simulate brief delay
    setTimeout(() => {
      const feedback = evaluateAnswer(question, currentAnswer);
      const nextStep = session.currentStep + 1;

      setSession({
        ...session,
        answers: { ...session.answers, [question.id]: currentAnswer },
        feedbacks: { ...session.feedbacks, [question.id]: feedback },
        currentStep: nextStep,
        completedAt: nextStep >= session.questions.length ? new Date().toISOString() : undefined,
      });
      setCurrentAnswer("");
      setShowHints(false);
      setSubmitting(false);
    }, 500);
  }

  if (!session) return null;

  const currentQuestion = session.questions[session.currentStep];
  const isComplete = session.currentStep >= session.questions.length;
  const answeredCount = Object.keys(session.answers).length;

  // Calculate overall scores
  const allFeedbacks = Object.values(session.feedbacks);
  const avgOverall = allFeedbacks.length
    ? Math.round((allFeedbacks.reduce((s, f) => s + f.overallScore, 0) / allFeedbacks.length) * 20)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">{session.jobTitle}</h3>
          <p className="text-sm text-white/40">
            {answeredCount}/{session.questions.length} questions answered
          </p>
        </div>
        <button
          onClick={startNewSession}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Restart
        </button>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)]"
          initial={{ width: 0 }}
          animate={{ width: `${(answeredCount / session.questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question Steps */}
      <div className="flex flex-wrap gap-1.5">
        {session.questions.map((q, i) => {
          const answered = i < session.currentStep;
          const active = i === session.currentStep;
          const feedback = session.feedbacks[q.id];

          return (
            <button
              key={q.id}
              onClick={() => {
                if (answered) {
                  setSession({ ...session, currentStep: i });
                  setCurrentAnswer(session.answers[q.id] ?? "");
                }
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                active
                  ? "border border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
                  : answered
                    ? feedback && feedback.overallScore >= 4
                      ? "bg-[var(--neon-green)]/20 text-[var(--neon-green)]"
                      : "bg-[var(--neon-gold)]/20 text-[var(--neon-gold)]"
                    : "bg-white/5 text-white/30"
              } ${answered ? "cursor-pointer hover:bg-white/10" : ""}`}
            >
              {answered ? (feedback && feedback.overallScore >= 4 ? "\u2713" : "!") : i + 1}
            </button>
          );
        })}
      </div>

      {/* Completion screen */}
      {isComplete ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard glow className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-[var(--neon-green)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Interview Complete!</h3>
            <p className="text-sm text-white/50 mb-6">
              You answered all {session.questions.length} questions.
            </p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <ScoreRing score={avgOverall} size={72} strokeWidth={5} />
                <div className="text-xs text-white/40 mt-2">Overall</div>
              </div>
              <div className="text-left space-y-1">
                {allFeedbacks.slice(0, 3).map((f) => (
                  <div key={f.questionId} className="flex items-center gap-2">
                    <span className="text-xs text-white/40">Q{f.questionId}</span>
                    <RatingStars score={f.overallScore} />
                  </div>
                ))}
                {allFeedbacks.length > 3 && (
                  <span className="text-xs text-white/30">+{allFeedbacks.length - 3} more</span>
                )}
              </div>
            </div>
            <button
              onClick={startNewSession}
              className="px-6 py-2 rounded-lg border border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)] text-sm font-medium hover:bg-[var(--neon-cyan)]/10 transition-colors"
            >
              Try Again
            </button>
          </GlassCard>
        </motion.div>
      ) : currentQuestion ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Question */}
            <GlassCard>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--neon-cyan)]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-[var(--neon-cyan)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={categoryColors[currentQuestion.category]}>
                      {currentQuestion.category.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-white/30">
                      Question {session.currentStep + 1} of {session.questions.length}
                    </span>
                  </div>
                  <p className="text-white font-medium">{currentQuestion.question}</p>
                </div>
              </div>

              {/* Hints */}
              <div className="mt-3">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-1 text-xs text-[var(--neon-gold)] hover:text-[var(--neon-gold)]/80 transition-colors"
                >
                  <Lightbulb className="w-3 h-3" />
                  {showHints ? "Hide hints" : "Show hints"}
                </button>
                {showHints && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 space-y-1 pl-4"
                  >
                    {currentQuestion.hints.map((hint, i) => (
                      <li key={i} className="text-xs text-[var(--neon-gold)]/70 list-disc">
                        {hint}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </GlassCard>

            {/* Answer input */}
            <GlassCard>
              <TextareaWithCounter
                value={currentAnswer}
                onChange={setCurrentAnswer}
                placeholder="Type your answer here... Use the STAR format for behavioral questions."
                rows={6}
                maxLength={3000}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-white/30">
                  {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={currentAnswer.trim().length < 10 || submitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-cyan)]/80 text-black font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_var(--neon-cyan)] transition-all"
                >
                  <Send className="w-4 h-4" />
                  Submit Answer
                </button>
              </div>
            </GlassCard>

            {/* Show previous feedback if reviewing */}
            {session.feedbacks[currentQuestion.id] && (
              <FeedbackCard feedback={session.feedbacks[currentQuestion.id]} />
            )}
          </motion.div>
        </AnimatePresence>
      ) : null}
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: InterviewFeedback }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard glow>
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[var(--neon-cyan)]" />
          Feedback
        </h4>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <div className="text-xs text-white/40 mb-1">Clarity</div>
            <RatingStars score={feedback.clarityScore} />
          </div>
          <div className="text-center">
            <div className="text-xs text-white/40 mb-1">STAR Format</div>
            <RatingStars score={feedback.starFormatScore} />
          </div>
          <div className="text-center">
            <div className="text-xs text-white/40 mb-1">Tech Depth</div>
            <RatingStars score={feedback.techDepthScore} />
          </div>
        </div>

        <p className="text-sm text-white/70 mb-3">{feedback.feedback}</p>

        {feedback.missingPoints.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-white/40 mb-1">Missing Points:</div>
            <ul className="space-y-1">
              {feedback.missingPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--neon-gold)]">
                  <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <details className="group">
          <summary className="text-xs text-[var(--neon-cyan)] cursor-pointer hover:text-[var(--neon-cyan)]/80">
            View suggested answer approach
          </summary>
          <div className="mt-2 p-3 rounded-lg bg-white/5 text-xs text-white/60 whitespace-pre-line">
            {feedback.suggestedAnswer}
          </div>
        </details>
      </GlassCard>
    </motion.div>
  );
}
