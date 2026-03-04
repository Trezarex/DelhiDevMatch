"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";

const StarField = dynamic(
  () => import("@/components/layout/StarField").then((m) => ({ default: m.StarField })),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <>
      <StarField />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <HowItWorks />
        {/* CTA */}
        <section className="py-24 text-center px-4">
          <div className="max-w-2xl mx-auto glass rounded-2xl p-10">
            <h2 className="text-3xl font-bold text-shimmer mb-4">
              Ready to Find Your Match?
            </h2>
            <p className="text-white/50 mb-6">
              No sign-up required. Start exploring Delhi/NCR tech jobs with trust scores and personalized matching.
            </p>
            <a
              href="/app/jobs"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-cyan)]/80 text-black font-semibold hover:shadow-[0_0_30px_var(--neon-cyan)] transition-all duration-300"
            >
              Get Started
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
