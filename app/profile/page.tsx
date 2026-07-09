"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Toast, { showToast } from "@/components/Toast";
import api from "@/lib/api";

const ALL_SKILLS = ["Python", "React", "Next.js", "TypeScript", "Tailwind", "Machine Learning", "FastAPI", "Node.js"];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>({ name: "", email: "", phone: "", location: "" });
  const [skills, setSkills] = useState<string[]>(["Python", "React", "Next.js", "TypeScript"]);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    api.get("/auth/me").then(r => setUser(r.data)).catch(() => router.push("/login"));
  }, []);

  const save = async () => {
    try {
      await api.put("/auth/me", { name: user.name });
      showToast("✅ Profile updated!");
    } catch { showToast("❌ Update failed."); }
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
      <Navbar />
      <Toast />
      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {/* Left */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#5c67f2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {user.name?.charAt(0) || "U"}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>CSE (AIML) · Final Year</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>{user.email}</div>
          <div style={{ margin: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            <div className="resume-score">
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".5px" }}>AI Resume Score</div>
              <div className="score-num">82</div>
              <div style={{ fontSize: 11, color: "#4ade80" }}>Top 20% of applicants</div>
            </div>
          </div>
          <button className="btn-sm" style={{ width: "100%", textAlign: "center" }}>Upload New Resume</button>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Personal Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Full Name", "name"], ["Email", "email"], ["Phone", "phone"], ["Location", "location"]].map(([label, key]) => (
                <div className="form-group" style={{ margin: 0 }} key={key}>
                  <label className="label">{label}</label>
                  <input value={(user as any)[key] || ""} onChange={e => setUser((p: any) => ({ ...p, [key]: e.target.value }))} readOnly={key === "email"} />
                </div>
              ))}
            </div>
            <button className="btn-sm" style={{ marginTop: 14 }} onClick={save}>Save Changes</button>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {ALL_SKILLS.map(s => (
                <span key={s} onClick={() => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}
                  className={`badge ${skills.includes(s) ? "b-purple" : ""}`}
                  style={{ cursor: "pointer", background: skills.includes(s) ? undefined : "#1a1a24", color: skills.includes(s) ? undefined : "#6b7280" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}