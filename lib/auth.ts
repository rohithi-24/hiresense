export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("is_admin") === "true";
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("is_admin");
  window.location.href = "/";
}