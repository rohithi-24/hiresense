"use client";
import { useEffect, useState } from "react";

let _show: (msg: string) => void = () => {};
export const showToast = (msg: string) => _show(msg);

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    _show = (m: string) => {
      setMsg(m);
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };
  }, []);

  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20,
      background: "#1e1e2e", border: "1px solid rgba(124,58,237,0.3)",
      color: "#fff", padding: "12px 16px", borderRadius: 10,
      fontSize: 12, zIndex: 999, display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    }}>
      {msg}
    </div>
  );
}