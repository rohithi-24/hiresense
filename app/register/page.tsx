"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !email || !password) { setError("Please fill all fields."); return; }
    setError(""); setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      const form = new FormData();
      form.append("username", email);
      form.append("password", password);
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.detail || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-title">Create account</div>
        <div className="auth-sub">Join HireSense and get hired faster</div>
        {error && <div className="error-box">{error}</div>}
        <div className="form-group">
          <label className="label">Full Name</label>
          <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#6b7280" }}>
          Already have an account? <Link href="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}