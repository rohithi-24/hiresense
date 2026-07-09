"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) { setError("Enter credentials."); return; }
    setError(""); setLoading(true);
    try {
      const form = new FormData();
      form.append("username", email); form.append("password", password);
      const res = await api.post("/auth/admin-login", form);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("is_admin", "true");
      router.push("/admin/dashboard");
    } catch { setError("Invalid admin credentials."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1117" }}>
      <div className="auth-card" style={{ background: "#0d1117", borderColor: "rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#5c67f2,#8b5cf6)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
          <div><div style={{ fontSize: 13, fontWeight: 700 }}>Admin Portal</div><div style={{ fontSize: 11, color: "#6b7280" }}>HireSense · Gaint Clout</div></div>
        </div>
        <div className="auth-title">Admin Login</div>
        <div className="auth-sub">HR & Admin staff only</div>
        {error && <div className="error-box">{error}</div>}
        <div className="form-group">
          <label className="label">Email</label>
          <input type="email" placeholder="admin@hiresense.com" value={email} onChange={e => setEmail(e.target.value)} style={{ background: "#1a1f2e", borderColor: "#2a3040" }} />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ background: "#1a1f2e", borderColor: "#2a3040" }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? "Accessing..." : "Access Admin Panel"}</button>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12 }}>
          <Link href="/login" className="auth-link">← Applicant login</Link>
        </div>
      </div>
    </div>
  );
}