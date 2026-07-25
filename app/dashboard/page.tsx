"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import api, { normalizeError } from "@/lib/api";
import { AxiosError } from "axios";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState<{ ai_score_avg: number; profile_views: number }>({ ai_score_avg: 0, profile_views: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [userRes, appsRes, statsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/applications/my"),
          api.get("/auth/me/stats"),
        ]);
        if (!cancelled) {
          setUser(userRes.data);
          setApplications(appsRes.data.slice(0, 3));
          setStats(statsRes.data);
        }
      } catch (e) {
        if (!cancelled) {
          const err = normalizeError(e as AxiosError);
          if (err.status === 401) {
            router.push("/login");
          } else {
            setError(err.message);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const statusBadge: Record<string, string> = {
    "Under Review": "b-review", Interview: "b-interview", Hired: "b-hired", Rejected: "b-rejected",
  };

  if (loading) {
    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ padding: 24, color: "#9ca3af", fontSize: 13 }}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Welcome back, {user?.name?.split(" ")[0]} 👋</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Here's your hiring activity at a glance.</div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 8, padding: "10px 14px", fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          <div className="stat-card"><div className="stat-label">Applications Sent</div><div className="stat-val">{applications.length || "—"}</div><div className="stat-sub">Track your progress</div></div>
          <div className="stat-card"><div className="stat-label">Interviews</div><div className="stat-val">{applications.filter(a => a.status === "Interview").length}</div><div className="stat-sub warn">Check schedule</div></div>
          <div className="stat-card"><div className="stat-label">AI Score (avg)</div><div className="stat-val" style={{ color: "#a78bfa" }}>{stats.ai_score_avg}</div><div className="stat-sub">{stats.ai_score_avg >= 80 ? "Top 20%" : stats.ai_score_avg > 0 ? "Keep improving" : "No scores yet"}</div></div>
          <div className="stat-card"><div className="stat-label">Profile Views</div><div className="stat-val">{stats.profile_views}</div><div className="stat-sub">Updated live</div></div>
        </div>

        {/* Recent applications */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: 13, fontWeight: 600 }}>Recent Applications</span>
            <Link href="/applications" className="auth-link" style={{ fontSize: 11 }}>View all →</Link>
          </div>
          <table className="hs-table">
            <thead><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan={4} style={{ color: "#6b7280", textAlign: "center", padding: 24 }}>No applications yet. <Link href="/jobs" className="auth-link">Browse jobs →</Link></td></tr>
              ) : applications.map((a, i) => (
                <tr key={i}>
                  <td style={{ color: "#fff" }}>{a.job_title}</td>
                  <td style={{ color: "#9ca3af" }}>{a.company}</td>
                  <td style={{ color: "#6b7280" }}>{new Date(a.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</td>
                  <td><span className={`badge ${statusBadge[a.status] || "b-review"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom grid */}
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="card">
            <div className="card-header"><span style={{ fontSize: 13, fontWeight: 600 }}>Recommended Jobs</span></div>
            <div style={{ padding: "14px 16px" }}>
              {[{ title: "ML Engineer", sub: "Remote · ₹8-12 LPA" }, { title: "React Developer", sub: "Hyderabad · ₹6-9 LPA" }].map((j) => (
                <div key={j.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div><div style={{ fontSize: 13, fontWeight: 500 }}>{j.title}</div><div style={{ fontSize: 11, color: "#6b7280" }}>{j.sub}</div></div>
                  <Link href="/jobs"><button className="btn-sm">Apply</button></Link>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span style={{ fontSize: 13, fontWeight: 600 }}>AI Resume Tips</span></div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ color: "#f87171" }}>⚠</span>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>Add more quantifiable achievements to your resume.</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#4ade80" }}>✓</span>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>Your skills section matches 3 active job postings.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}