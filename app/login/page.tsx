"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/services/auth";
import { loginSchema } from "@/lib/validation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path.join(".")] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.access_token || data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="auth-card">
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Log in to your HireSense account</div>

        <div className="form-group">
          <label className="label">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ background: "#1a1f2e", borderColor: fieldErrors.email ? "#f87171" : "#2a3040" }}
          />
          {fieldErrors.email && <div style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>{fieldErrors.email}</div>}
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ background: "#1a1f2e", borderColor: fieldErrors.password ? "#f87171" : "#2a3040" }}
          />
          {fieldErrors.password && <div style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>{fieldErrors.password}</div>}
        </div>

        {error && <div style={{ color: "#f87171", fontSize: 12, marginBottom: 10 }}>{error}</div>}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: "100%" }}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <Link href="/register" className="auth-link" style={{ fontSize: 12 }}>New here? Register →</Link>
          <Link href="/admin-login" style={{ color: "#6b7280", textDecoration: "none", fontSize: 12 }}>Admin? →</Link>
        </div>
      </div>
    </div>
  );
}