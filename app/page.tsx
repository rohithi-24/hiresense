"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#fff" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #18181b", background: "#0c0c12" }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>
          Hire<span style={{ color: "#a78bfa" }}>Sense</span>
          <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 4 }}>by Gaint Clout</span>
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/login"><button className="nav-btn-outline">Sign In</button></Link>
          <Link href="/register"><button className="nav-btn">Get Started</button></Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px" }}>
        <div style={{ display: "inline-block", border: "1px solid rgba(255,255,255,0.15)", color: "#9ca3af", fontSize: 11, padding: "4px 12px", borderRadius: 20, marginBottom: 24 }}>
          AI-POWERED HIRING PLATFORM
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
          The Smarter Way to<br />
          <span style={{ background: "linear-gradient(135deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Get Hired
          </span>
        </h1>
        <p style={{ fontSize: 14, color: "#9ca3af", maxWidth: 440, margin: "0 auto 32px" }}>
          HireSense uses AI to score your resume, match you to the right jobs, and help you stand out from the crowd.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/register"><button className="nav-btn" style={{ padding: "12px 28px", fontSize: 14 }}>Start Free Today</button></Link>
          <Link href="/login"><button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign In</button></Link>
        </div>
      </div>

      {/* Features */}
      <p style={{ textAlign: "center", fontSize: 11, color: "#6b7280", letterSpacing: ".8px", textTransform: "uppercase", marginBottom: 20 }}>
        Everything you need to get hired faster
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, padding: "0 24px 48px" }}>
        {[
          { icon: "🧠", title: "AI Resume Scoring", desc: "Get your resume scored and ranked against real job requirements instantly." },
          { icon: "📊", title: "Smart Dashboard", desc: "Track all your applications, interviews, and hiring progress in one place." },
          { icon: "⚡", title: "Fast Shortlisting", desc: "Get shortlisted faster with AI-matched job recommendations." },
        ].map((f) => (
          <div key={f.title} style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
            <div style={{ width: 40, height: 40, background: "#1a1a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Admin link */}
      <div style={{ textAlign: "center", paddingBottom: 32 }}>
        <Link href="/admin-login" style={{ fontSize: 11, color: "#6b7280", textDecoration: "none" }}>Admin? →</Link>
      </div>
    </div>
  );
}