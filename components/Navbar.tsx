"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
  { href: "/applications", label: "Applications" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 24px", borderBottom: "1px solid #18181b", background: "#0c0c12",
    }}>
      <Link href="/dashboard" style={{ textDecoration: "none" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
          Hire<span style={{ color: "#a78bfa" }}>Sense</span>
        </span>
      </Link>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} style={{
            fontSize: 12, textDecoration: "none",
            color: pathname === l.href ? "#a78bfa" : "#6b7280",
            borderBottom: pathname === l.href ? "2px solid #7c3aed" : "2px solid transparent",
            paddingBottom: 2,
          }}>{l.label}</Link>
        ))}
        <button onClick={logout} className="nav-btn-outline" style={{ fontSize: 11, padding: "5px 10px", color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}