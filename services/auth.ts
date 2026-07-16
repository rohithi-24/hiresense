import api from "@/lib/api"

export const loginUser = async (email: string, password: string) => {
  const formData = new URLSearchParams()
  formData.append("username", email)
  formData.append("password", password)

  const res = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  return res.data
}

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { name, email, password })
  return res.data
}