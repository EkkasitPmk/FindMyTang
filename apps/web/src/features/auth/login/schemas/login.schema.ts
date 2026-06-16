import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .email({ error: "Invalid email format" })
    .min(1, { error: "Email is required" }),
  password: z
    .string()
    .min(1, { error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

