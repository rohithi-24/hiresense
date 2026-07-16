"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/services/auth";
import { registerSchema } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setFieldErrors({});

    const result = registerSchema.safeParse({ name, email, password, confirmPassword });
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
      await registerUser(name, email, password);
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="auth-card">
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Start applying to jobs with HireSense</div>

        <div className="form-group">
          <label className="label">Full Name</label>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ background: "#1a1f2e", borderColor: fieldErrors.name ? "#f87171" : "#2a3040" }}
          />
          {fieldErrors.name && <div style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>{fieldErrors.name}</div>}
        </div>

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

        <div className="form-group">
          <label className="label">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ background: "#1a1f2e", borderColor: fieldErrors.confirmPassword ? "#f87171" : "#2a3040" }}
          />
          {fieldErrors.confirmPassword && <div style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>{fieldErrors.confirmPassword}</div>}
        </div>

        {error && <div style={{ color: "#f87171", fontSize: 12, marginBottom: 10 }}>{error}</div>}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: "100%" }}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/login" className="auth-link" style={{ fontSize: 12 }}>Already have an account? Log in →</Link>
        </div>
      </div>
    </div>
  );
}