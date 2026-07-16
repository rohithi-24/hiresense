"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api, { normalizeError } from "@/lib/api";
import { AxiosError } from "axios";

type Application = {
  id: number;
  job_title: string;
  company: string;
  applied_date: string;
  ai_score: number | null;
  status: string;
};

const statusClass: Record<string, string> = {
  interview: "b-interview",
  hired: "b-hired",
  rejected: "b-rejected",
  under_review: "b-review",
  applied: "b-review",
};

const statusLabel: Record<string, string> = {
  interview: "Interview",
  hired: "Hired",
  rejected: "Rejected",
  under_review: "Under Review",
  applied: "Under Review",
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    api.get("/applications/my")
      .then(r => setApps(r.data))
      .catch((e) => {
        const err = normalizeError(e as AxiosError);
        if (err.status === 401) {
          router.push("/login");
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    review: apps.filter(a => ["applied", "under_review"].includes(a.status)).length,
    interview: apps.filter(a => a.status === "interview").length,
    hired: apps.filter(a => a.status === "hired").length,
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>My Applications</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Track all your applications and AI scores.</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="badge b-review">Under Review ({counts.review})</span>
            <span className="badge b-interview">Interview ({counts.interview})</span>
            <span className="badge b-hired">Hired ({counts.hired})</span>
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 8, padding: "10px 14px", fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="card">
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>Loading...</div>
          ) : apps.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              No applications yet.{" "}
              <span style={{ color: "#a78bfa", cursor: "pointer" }} onClick={() => router.push("/jobs")}>Browse jobs →</span>
            </div>
          ) : (
            <table className="hs-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Applied</th>
                  <th>AI Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id}>
                    <td style={{ color: "#fff", fontWeight: 500 }}>{app.job_title}</td>
                    <td style={{ color: "#9ca3af" }}>{app.company}</td>
                    <td style={{ color: "#6b7280" }}>
                      {new Date(app.applied_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td style={{ color: "#a78bfa", fontWeight: 600 }}>
                      {app.ai_score != null ? `${app.ai_score}/100` : "—"}
                    </td>
                    <td>
                      <span className={`badge ${statusClass[app.status] || "b-review"}`}>
                        {statusLabel[app.status] || app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}