"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api, { normalizeError } from "@/lib/api";
import { AxiosError } from "axios";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    api.get("/jobs/")
      .then(r => setJobs(r.data))
      .catch((e) => setError(normalizeError(e as AxiosError).message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j =>
    (!search || j.title.toLowerCase().includes(search.toLowerCase())) &&
    (!location || j.location === location) &&
    (!type || j.type === type)
  );

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Job Listings</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Find and apply to the best opportunities.</div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input placeholder="Search jobs, roles, skills..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
          <select value={location} onChange={e => setLocation(e.target.value)} style={{ width: "auto" }}>
            <option value="">All Locations</option>
            <option>Hyderabad</option><option>Remote</option><option>Bangalore</option>
          </select>
          <select value={type} onChange={e => setType(e.target.value)} style={{ width: "auto" }}>
            <option value="">All Types</option>
            <option>Full-time</option><option>Internship</option><option>Contract</option>
          </select>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: 8, padding: "10px 14px", fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading && <div style={{ color: "#6b7280", padding: 24 }}>Loading jobs...</div>}
          {!loading && filtered.length === 0 && !error && <div style={{ color: "#6b7280", padding: 24 }}>No jobs found.</div>}
          {!loading && filtered.map((j) => (
            <div key={j.id} className="job-card">
              <div>
                <span className="badge b-purple" style={{ marginBottom: 6, display: "inline-block" }}>{j.type}</span>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{j.title}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{j.company} · {j.location} · {j.salary}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Posted {new Date(j.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} · {j.applicant_count || 0} applicants</div>
              </div>
              <button className="btn-sm" onClick={() => router.push(`/jobs/${j.id}/apply`)}>Apply Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}