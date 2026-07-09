"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    api.get("/jobs/").then(r => setJobs(r.data)).catch(() => {});
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

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 && <div style={{ color: "#6b7280", padding: 24 }}>No jobs found.</div>}
          {filtered.map((j) => (
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