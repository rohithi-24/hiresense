import api from "@/lib/api";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  posted_date: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
}

export async function fetchJobs(filters: JobFilters = {}): Promise<Job[]> {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.location) params.append("location", filters.location);
  if (filters.type) params.append("type", filters.type);

  const { data } = await api.get(`/jobs?${params.toString()}`);
  return data;
}

export async function fetchJobById(id: string): Promise<Job> {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
}

export async function submitApplication(jobId: string, formData: FormData) {
  const { data } = await api.post(`/jobs/${jobId}/apply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}