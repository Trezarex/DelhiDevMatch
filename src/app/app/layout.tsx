"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";

const StarField = dynamic(
  () => import("@/components/layout/StarField").then((m) => ({ default: m.StarField })),
  { ssr: false }
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [starfield, setStarfield] = useState(true);

  return (
    <>
      {starfield && <StarField />}
      <Navbar />
      <main className="relative z-10 min-h-screen pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {children}
        </div>
        {/* Starfield toggle */}
        <button
          onClick={() => setStarfield(!starfield)}
          className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-full text-[10px] glass text-white/40 hover:text-white/60 transition-colors"
          title="Toggle starfield"
        >
          {starfield ? "Stars ON" : "Stars OFF"}
        </button>
      </main>
      <Footer />
    </>
  );
}
