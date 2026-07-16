"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, isAdmin } from "@/lib/auth";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(requireAdmin ? "/admin-login" : "/login");
      return;
    }
    if (requireAdmin && !isAdmin()) {
      router.push("/admin-login");
      return;
    }
    setChecked(true);
  }, [router, requireAdmin]);

  if (!checked) return null;

  return <>{children}</>;
}