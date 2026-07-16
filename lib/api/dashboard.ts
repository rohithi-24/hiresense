import api from "@/lib/api";

export interface DashboardStats {
  applications_sent: number;
  interviews: number;
  ai_score_avg: number;
  profile_views: number;
}

export interface RecentApplication {
  id: string;
  job_title: string;
  company: string;
  applied_date: string;
  status: "under_review" | "interview" | "hired" | "rejected";
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get("/applicant/dashboard/stats");
  return data;
}

export async function fetchRecentApplications(): Promise<RecentApplication[]> {
  const { data } = await api.get("/applicant/applications/recent");
  return data;
}

export interface AdminStats {
  total_applicants: number;
  open_jobs: number;
  total_applications: number;
  hired_count: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get("/admin/dashboard/stats");
  return data;
}

export async function fetchActivityLog(limit = 20) {
  const { data } = await api.get(`/admin/activity-log?limit=${limit}`);
  return data;
}