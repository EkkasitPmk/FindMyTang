import * as z from "zod";

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(1, "errDisplayNameRequired")
      .max(25, "Display name must be under 25 characters"),
    email: z.email("errInvalidEmail").min(1, "errEmailRequired"),
    password: z
      .string()
      .min(1, "errPasswordRequired")
      .min(8, "errPasswordLength"),
    confirmPassword: z.string().min(1, "errConfirmPasswordRequired"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "errAgreeTermsRequired",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errPasswordsNotMatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
