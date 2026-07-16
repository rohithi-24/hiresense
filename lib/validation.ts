import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name is too long").regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Include at least one uppercase letter").regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const applicationStep1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^\+?[0-9]{10,13}$/, "Enter a valid phone number"),
  location: z.string().min(2, "Location is required"),
  linkedinUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export const applicationStep2Schema = z.object({
  resumeFile: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, "Resume must be under 5MB")
    .refine(
      (f) => ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type),
      "Only PDF or DOC files are allowed"
    ),
  coverLetter: z.string().max(2000, "Cover letter is too long").optional(),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
});

export function getFieldErrors<T>(
  result: { success: true; data: T } | { success: false; error: z.ZodError }
) {
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}