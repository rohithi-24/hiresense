"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast, { showToast } from "@/components/Toast";
import api from "@/lib/api";

type Tab = "dash" | "applicants" | "jobs" | "ai";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dash");
  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState<any>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/admin-login"); return; }
    api.get("/applicants/").then(r => setApplicants(r.data)).catch(() => {});
    api.get("/jobs/").then(r => setJobs(r.data)).catch(() => {});
  }, []);

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("is_admin"); router.push("/"); };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/applicants/${id}/status`, { status });
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      showToast(`Status → ${status}`);
    } catch { showToast("❌ Update failed"); }
  };

  const cycleStatus = (app: any) => {
    const statuses = ["Under Review", "Interview", "Hired", "Rejected"];
    const next = statuses[(statuses.indexOf(app.status) + 1) % 4];
    updateStatus(app.id, next);
  };

  const statusBadge: Record<string, string> = {
    "Under Review": "b-review", Interview: "b-interview", Hired: "b-hired", Rejected: "b-rejected",
  };

  const scoreColor = (s: number) => s >= 85 ? "#4ade80" : s >= 70 ? "#60a5fa" : s >= 60 ? "#eab308" : "#f87171";

  const filteredApps = applicants.filter(a =>
    !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const navLink = (t: Tab, label: string) => (
    <span onClick={() => { setTab(t); setDrawer(null); }}
      style={{ fontSize: 12, cursor: "pointer", color: tab === t ? "#a78bfa" : "#6b7280", borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent", paddingBottom: 2 }}>
      {label}
    </span>
  );

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", position: "relative" }}>
      <Toast />
      {/* Top Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #18181b", background: "#0c0c12" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#5c67f2", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🛡️</div>
          <div><div style={{ fontSize: 12, fontWeight: 700 }}>HireSense Admin</div><div style={{ fontSize: 10, color: "#6b7280" }}>Gaint Clout</div></div>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {navLink("dash", "Dashboard")}
          {navLink("applicants", "Applicants")}
          {navLink("jobs", "Jobs")}
          <span onClick={() => { setTab("ai"); setDrawer(null); }}
            style={{ fontSize: 12, cursor: "pointer", color: tab === "ai" ? "#a78bfa" : "#a78bfa", opacity: tab === "ai" ? 1 : 0.7, borderBottom: tab === "ai" ? "2px solid #7c3aed" : "2px solid transparent", paddingBottom: 2 }}>
            🧠 AI Screening
          </span>
          <button onClick={logout} className="nav-btn-outline" style={{ fontSize: 11, padding: "5px 10px", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>Logout</button>
        </div>
      </nav>

      {/* DASH TAB */}
      {tab === "dash" && (
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Admin Dashboard</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Overview of all hiring activity.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            <div className="stat-card"><div className="stat-label">Total Applicants</div><div className="stat-val">{applicants.length}</div><div className="stat-sub">All time</div></div>
            <div className="stat-card"><div className="stat-label">Open Jobs</div><div className="stat-val">{jobs.length}</div><div className="stat-sub">Active listings</div></div>
            <div className="stat-card"><div className="stat-label">Interviews</div><div className="stat-val">{applicants.filter(a => a.status === "Interview").length}</div><div className="stat-sub warn">Scheduled</div></div>
            <div className="stat-card"><div className="stat-label">Hired</div><div className="stat-val">{applicants.filter(a => a.status === "Hired").length}</div><div className="stat-sub">Conversion</div></div>
          </div>
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: 13, fontWeight: 600 }}>Recent Applicants</span>
              <span style={{ fontSize: 11, color: "#6b7280" }}>Showing 5 of {applicants.length}</span>
            </div>
            <table className="hs-table">
              <thead><tr><th>Name</th><th>Email</th><th>Applied For</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {applicants.slice(0, 5).map((a, i) => (
                  <tr key={i}>
                    <td style={{ color: "#fff" }}>{a.name}</td>
                    <td style={{ color: "#9ca3af" }}>{a.email}</td>
                    <td style={{ color: "#9ca3af" }}>{a.applied_for || "—"}</td>
                    <td><span className={`badge ${statusBadge[a.status] || "b-review"}`}>{a.status || "Under Review"}</span></td>
                    <td style={{ color: "#6b7280" }}>{a.date || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPLICANTS TAB */}
      {tab === "applicants" && (
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Applicant Management</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Manage and update applicant statuses.</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input placeholder="Search applicants..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
            <select style={{ width: "auto", background: "#1a1a24", border: "1px solid #2a2a3a", color: "#fff", padding: "10px 12px", borderRadius: 10, fontSize: 12 }}>
              <option value="">All Status</option>
              <option>Under Review</option><option>Interview</option><option>Hired</option><option>Rejected</option>
            </select>
          </div>
          <div className="card">
            <table className="hs-table">
              <thead><tr><th>Name</th><th>Email</th><th>Applied For</th><th>Status</th><th>Date</th><th>Action</th><th>AI</th></tr></thead>
              <tbody>
                {filteredApps.map((a) => (
                  <tr key={a.id}>
                    <td style={{ color: "#fff" }}>{a.name}</td>
                    <td style={{ color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{a.email}</td>
                    <td style={{ color: "#9ca3af" }}>{a.applied_for || "—"}</td>
                    <td><span className={`badge ${statusBadge[a.status] || "b-review"}`}>{a.status || "Under Review"}</span></td>
                    <td style={{ color: "#6b7280" }}>{a.date || "—"}</td>
                    <td><button className="btn-sm" onClick={() => cycleStatus(a)}>Update</button></td>
                    <td>
                      <button className="btn-sm" onClick={() => setDrawer(a)} style={{ color: scoreColor(a.ai_score || 0) }}>
                        {a.ai_score || "—"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#6b7280" }}>Showing 1–{filteredApps.length} of {filteredApps.length}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="page-btn">Prev</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOBS TAB */}
      {tab === "jobs" && (
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 20, fontWeight: 700 }}>Job Postings</div><div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Manage all open positions.</div></div>
            <button className="nav-btn">+ Post New Job</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {jobs.map((j) => (
              <div key={j.id} className="job-card">
                <div>
                  <span className="badge b-purple" style={{ marginBottom: 6, display: "inline-block" }}>{j.type}</span>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{j.title}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{j.location} · {j.applicant_count || 0} applicants</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-sm">Edit</button>
                  <button className="btn-danger-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI TAB */}
      {tab === "ai" && (
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div><div style={{ fontSize: 20, fontWeight: 700 }}>AI Resume Screening</div><div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>AI-ranked applicants by resume match score.</div></div>
            <div style={{ display: "flex", gap: 8 }}>
              <select style={{ background: "#1a1a24", border: "1px solid #2a2a3a", color: "#fff", padding: "8px 12px", borderRadius: 10, fontSize: 12 }}>
                <option>All Jobs</option>{jobs.map(j => <option key={j.id}>{j.title}</option>)}
              </select>
              <button className="btn-sm" style={{ padding: "8px 14px" }}>Export CSV</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
            <div className="stat-card"><div className="stat-label">Screened</div><div className="stat-val">{applicants.length}</div><div className="stat-sub">Total processed</div></div>
            <div className="stat-card"><div className="stat-label">Avg AI Score</div><div className="stat-val" style={{ color: "#a78bfa" }}>{applicants.length ? Math.round(applicants.reduce((s, a) => s + (a.ai_score || 0), 0) / applicants.length) : "—"}</div><div className="stat-sub">Out of 100</div></div>
            <div className="stat-card"><div className="stat-label">Shortlisted</div><div className="stat-val">{applicants.filter(a => (a.ai_score || 0) >= 80).length}</div><div className="stat-sub warn">Score ≥ 80</div></div>
          </div>
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: 13, fontWeight: 600 }}>Ranked Applicants</span>
              <span style={{ fontSize: 11, color: "#6b7280" }}>Sorted by AI score · highest first</span>
            </div>
            <table className="hs-table">
              <thead><tr><th>#</th><th>Name</th><th>Role</th><th>AI Score</th><th>Skills Match</th><th>Action</th></tr></thead>
              <tbody>
                {[...applicants].sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0)).map((a, i) => (
                  <tr key={a.id} onClick={() => setDrawer(a)} style={{ cursor: "pointer" }}>
                    <td style={{ color: scoreColor(a.ai_score || 0), fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ color: "#fff" }}>{a.name}</td>
                    <td style={{ color: "#9ca3af" }}>{a.applied_for || "—"}</td>
                    <td>
                      <span style={{ color: scoreColor(a.ai_score || 0), fontWeight: 700 }}>{a.ai_score || "—"}</span>
                      <div style={{ background: "#1a1a24", borderRadius: 20, height: 4, marginTop: 4, width: 80 }}>
                        <div style={{ background: scoreColor(a.ai_score || 0), height: 4, borderRadius: 20, width: `${a.ai_score || 0}%`, transition: "width .5s" }} />
                      </div>
                    </td>
                    <td><span className={`badge ${(a.ai_score || 0) >= 85 ? "b-hired" : (a.ai_score || 0) >= 70 ? "b-interview" : "b-review"}`}>{(a.ai_score || 0) >= 85 ? "Strong" : (a.ai_score || 0) >= 70 ? "Good" : "Average"}</span></td>
                    <td><button className="btn-sm" onClick={e => { e.stopPropagation(); setDrawer(a); }}>View Report</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Drawer */}
      {drawer && (
        <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 360, background: "#0d0d16", borderLeft: "1px solid rgba(255,255,255,0.07)", padding: 24, overflowY: "auto", zIndex: 40 }}>
          <button onClick={() => setDrawer(null)} style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: "#6b7280", fontSize: 16, cursor: "pointer" }}>✕</button>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{drawer.name}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>{drawer.applied_for || "Applicant"}</div>
          <div className="resume-score" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>Overall AI Score</div>
            <div className="score-num">{drawer.ai_score || "—"}</div>
            <div style={{ fontSize: 11, color: scoreColor(drawer.ai_score || 0) }}>
              {(drawer.ai_score || 0) >= 85 ? "Strong Match" : (drawer.ai_score || 0) >= 70 ? "Good Match" : (drawer.ai_score || 0) >= 60 ? "Average Match" : "Weak Match"}
            </div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Score Breakdown</div>
          {[["Skills Match", Math.min((drawer.ai_score || 0) + 7, 100), "#a78bfa"], ["Experience", Math.max((drawer.ai_score || 0) - 8, 30), "#60a5fa"], ["Education", Math.min((drawer.ai_score || 0) + 3, 100), "#4ade80"], ["Keywords", Math.min((drawer.ai_score || 0) + 5, 100), "#eab308"]].map(([label, val, color]) => (
            <div key={label as string} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: "#9ca3af" }}>{label}</span>
                <span style={{ color: color as string, fontWeight: 600 }}>{val}</span>
              </div>
              <div style={{ background: "#1a1a24", borderRadius: 20, height: 6 }}>
                <div style={{ background: color as string, height: 6, borderRadius: 20, width: `${val}%`, transition: "width .5s" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, background: "#111118", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>AI Recommendations</div>
            <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {(drawer.ai_score || 0) >= 85 ? "✓ Excellent resume match\n✓ Strong skill alignment\n✓ Recommended for interview" : (drawer.ai_score || 0) >= 70 ? "✓ Good skill match\n⚠ Some experience gaps\n→ Consider phone screening first" : "⚠ Below average match\n⚠ Missing key skills\n✗ May not meet requirements"}
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button className="nav-btn" style={{ flex: 1, padding: 10 }} onClick={() => { updateStatus(drawer.id, "Interview"); setDrawer(null); }}>→ Interview</button>
            <button className="btn-danger-sm" style={{ flex: 1, padding: 10 }} onClick={() => { updateStatus(drawer.id, "Rejected"); setDrawer(null); }}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}