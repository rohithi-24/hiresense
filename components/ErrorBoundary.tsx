"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("HireSense UI crash:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong</div>
            <div style={{ fontSize: 13, color: "#9ca3af", maxWidth: 380 }}>
              We hit an unexpected error. Try refreshing the page — if it keeps happening, please contact support.
            </div>
            <button className="nav-btn" style={{ padding: "10px 24px", marginTop: 8 }} onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}