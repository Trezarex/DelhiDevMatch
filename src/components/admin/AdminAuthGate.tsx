"use client";

import { useState, useCallback, type ReactNode } from "react";

const TOKEN_KEY = "ddm_admin_token";

export function useAdminToken() {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(TOKEN_KEY);
  });

  const setToken = useCallback((t: string) => {
    sessionStorage.setItem(TOKEN_KEY, t);
    setTokenState(t);
  }, []);

  const clearToken = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
  }, []);

  return { token, setToken, clearToken };
}

export function AdminAuthGate({ children }: { children: ReactNode }) {
  const { token, setToken } = useAdminToken();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) {
    return <>{children}</>;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/jobs", {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (res.ok) {
        setToken(password);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--night-900)]">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm glass rounded-2xl p-8 space-y-4"
      >
        <h1 className="text-xl font-bold text-white text-center">Admin Login</h1>
        <p className="text-sm text-white/40 text-center">
          Enter the admin password to continue.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[var(--neon-cyan)]/50 focus:outline-none"
          autoFocus
        />
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-cyan)]/80 text-black font-semibold text-sm disabled:opacity-40 hover:shadow-[0_0_20px_var(--neon-cyan)] transition-all"
        >
          {loading ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
}
