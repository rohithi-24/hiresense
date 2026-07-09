"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Toast, { showToast } from "@/components/Toast";
import api from "@/lib/api";

const SKILLS = ["React", "Next.js", "TypeScript", "Node.js", "GraphQL", "Tailwind", "Python", "FastAPI"];

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", linkedin: "", cover_letter: "" });
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "Next.js", "TypeScript"]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (s: string) =>
    setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const submit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("job_id", String(id));
      fd.append("cover_letter", form.cover_letter);
      fd.append("skills", selectedSkills.join(", "));
      if (resumeFile) fd.append("resume", resumeFile);
      await api.post("/applications/apply", fd, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("🎉 Application submitted!");
      setTimeout(() => router.push("/applications"), 1200);
    } catch { showToast("❌ Submission failed. Try again."); }
    finally { setLoading(false); }
  };

  const dotStyle = (n: number) => ({
    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center" as const,
    justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
    background: n < step ? "#4ade80" : n === step ? "#7c3aed" : "#1a1a24",
    color: n <= step ? "#fff" : "#6b7280",
    border: n > step ? "1px solid #2a2a3a" : "none",
  });

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh" }}>
      <Navbar />
      <Toast />
      <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
        <div style={{ marginBottom: 6 }}>
          <button onClick={() => router.back()} className="auth-link" style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#a78bfa" }}>← Back to Jobs</button>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Apply for Frontend Engineer</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>Gaint Clout · Hyderabad · Full-time</div>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 8 }}>
          <div style={dotStyle(1)}>1</div>
          <div style={{ flex: 1, height: 2, background: step > 1 ? "#4ade80" : "#2a2a3a" }} />
          <div style={dotStyle(2)}>2</div>
          <div style={{ flex: 1, height: 2, background: step > 2 ? "#4ade80" : "#2a2a3a" }} />
          <div style={dotStyle(3)}>3</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontSize: 11 }}>
          {["Personal Info", "Resume & Skills", "Review & Submit"].map((l, i) => (
            <span key={l} style={{ color: i + 1 === step ? "#a78bfa" : "#6b7280" }}>{l}</span>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Personal Information</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Full Name", "name", "text", "John Doe"], ["Email", "email", "email", "you@example.com"], ["Phone", "phone", "text", "+91 XXXXX XXXXX"], ["Location", "location", "text", "Hyderabad, India"]].map(([label, key, type, ph]) => (
                  <div className="form-group" style={{ margin: 0 }} key={key}>
                    <label className="label">{label}</label>
                    <input type={type} placeholder={ph} value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="form-group" style={{ marginTop: 12, marginBottom: 0 }}>
                <label className="label">LinkedIn / Portfolio URL</label>
                <input placeholder="https://linkedin.com/in/yourname" value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="nav-btn" style={{ padding: "10px 24px" }} onClick={() => setStep(2)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Resume & Cover Letter</div>
              <div className="form-group">
                <label className="label">Upload Resume (PDF)</label>
                <label className="upload-zone" style={{ display: "block" }}>
                  <input type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) { setResumeFile(e.target.files[0]); showToast(`📎 ${e.target.files[0].name} selected`); } }} />
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{resumeFile ? resumeFile.name : "Click to upload your resume"}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>PDF, DOC up to 5MB · AI will score it instantly</div>
                </label>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Cover Letter <span style={{ color: "#4b5563" }}>(optional)</span></label>
                <textarea rows={4} placeholder="Tell the employer why you're a great fit..." value={form.cover_letter} onChange={e => setForm(p => ({ ...p, cover_letter: e.target.value }))} />
              </div>
            </div>
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Relevant Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {SKILLS.map(s => (
                  <span key={s} onClick={() => toggleSkill(s)} className={`badge ${selectedSkills.includes(s) ? "b-purple" : ""}`}
                    style={{ cursor: "pointer", background: selectedSkills.includes(s) ? undefined : "#1a1a24", color: selectedSkills.includes(s) ? undefined : "#6b7280" }}>
                    {s} {selectedSkills.includes(s) ? "✓" : ""}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Click to toggle. Purple = selected.</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-sm" style={{ padding: "8px 20px" }} onClick={() => setStep(1)}>← Back</button>
              <button className="nav-btn" style={{ padding: "10px 24px" }} onClick={() => setStep(3)}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Review Your Application</div>
              {[["Name", form.name], ["Email", form.email], ["Role", "Frontend Engineer"], ["Resume", resumeFile ? `✓ ${resumeFile.name}` : "Not uploaded"], ["Skills", selectedSkills.join(", ")]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{k}</span>
                  <span style={{ fontSize: 12, color: k === "Resume" && resumeFile ? "#4ade80" : "#fff" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 10, padding: 14, marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>🧠</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa" }}>AI will score your resume</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>After submission, our AI ranks your resume against the job requirements.</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn-sm" style={{ padding: "8px 20px" }} onClick={() => setStep(2)}>← Back</button>
              <button className="nav-btn" style={{ padding: "10px 28px" }} onClick={submit} disabled={loading}>{loading ? "Submitting..." : "Submit Application ✓"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
