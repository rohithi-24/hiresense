import api from "@/lib/api";

export interface Application {
  id: string;
  job_title: string;
  company: string;
  applied_date: string;
  status: "under_review" | "interview" | "hired" | "rejected";
}

export async function fetchMyApplications(status?: string): Promise<Application[]> {
  const q = status ? `?status=${status}` : "";
  const { data } = await api.get(`/applicant/applications${q}`);
  return data;
}

export async function withdrawApplication(id: string) {
  const { data } = await api.delete(`/applicant/applications/${id}`);
  return data;
}