import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .email("errInvalidEmail")
    .trim()
    .min(1, "errEmailRequired")
    .max(254, "errEmailLength"),
  password: z
    .string()
    .min(1, "errPasswordRequired")
    .min(8, "errPasswordLength"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
