import api from "@/lib/api";

export interface Profile {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  resume_url?: string;
}

export async function fetchProfile(): Promise<Profile> {
  const { data } = await api.get("/applicant/profile");
  return data;
}

export async function updateProfile(payload: Partial<Profile>) {
  const { data } = await api.put("/applicant/profile", payload);
  return data;
}

export async function uploadResume(file: File) {
  const form = new FormData();
  form.append("resume", file);
  const { data } = await api.post("/applicant/profile/resume", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}