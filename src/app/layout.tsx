import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DelhiDevMatch — Delhi/NCR Tech Job Matcher",
  description:
    "Hyper-local Delhi/NCR tech job matching with trust scoring, resume analysis, and mock interview coaching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--night-900)] text-white antialiased custom-scrollbar">
        {children}
      </body>
    </html>
  );
}
