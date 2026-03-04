import type { ReactNode } from "react";

export const metadata = {
  title: "Admin | DelhiDevMatch",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--night-900)]">
      {children}
    </div>
  );
}
