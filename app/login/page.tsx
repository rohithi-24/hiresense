"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError(""); setLoading(true);
    try {
      const form = new FormData();
      form.append("username", email);
      form.append("password", password);
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your HireSense account</div>
        {error && <div className="error-box">{error}</div>}
        <div className="form-group">
          <label className="label">Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#6b7280" }}>
          Don't have an account? <Link href="/register" className="auth-link">Register</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 11 }}>
          <Link href="/admin-login" style={{ color: "#6b7280", textDecoration: "none" }}>Admin? →</Link>
        </div>
      </div>
    </div>
  );
}