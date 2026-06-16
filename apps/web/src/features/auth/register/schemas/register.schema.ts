import * as z from "zod";

export const registerSchema = z
  .object({
    displayName: z.string().min(1, "Display name is required"),
    email: z
      .email({ error: "Invalid email format" })
      .min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      error: "You must agree to the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
