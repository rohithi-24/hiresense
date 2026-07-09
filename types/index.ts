export type User = {
  id: number
  name: string
  email: string
  role: "applicant" | "hr" | "admin"
}

export type Job = {
  id: number
  title: string
  description: string
  location: string
  created_at: string
}

export type Application = {
  id: number
  job_id: number
  job_title: string
  status: "pending" | "shortlisted" | "rejected"
  applied_at: string
  resume_score?: number
}