import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("errInvalidEmail").min(1, "errEmailRequired"),
  password: z
    .string()
    .min(1, "errPasswordRequired")
    .min(8, "errPasswordLength"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
