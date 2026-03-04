export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center">
              <span className="text-[10px] font-black text-white">D</span>
            </div>
            <span className="text-sm text-white/40">
              DelhiDevMatch &mdash; Hyper-local Delhi/NCR job matching
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>MVP v0.1</span>
            <span>&bull;</span>
            <span>Built with Next.js + Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
