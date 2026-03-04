"use client";

import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { AdminDashboard } from "./AdminDashboard";

export default function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminDashboard />
    </AdminAuthGate>
  );
}
