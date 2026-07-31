import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "errContactNameRequired")
    .max(50, "errContactNameLength"),
  email: z
    .string()
    .trim()
    .min(1, "errContactEmailRequired")
    .max(254, "errContactEmailLength")
    .pipe(z.email("errContactEmailInvalid")),
  phone: z
    .string()
    .trim()
    .min(1, "errContactPhoneRequired")
    .max(20, "errContactPhoneLength")
    .refine(
      (value) =>
        /^[+\d\s()-]+$/.test(value) && value.replace(/\D/g, "").length >= 7,
      "errContactPhoneInvalid",
    ),
  message: z
    .string()
    .trim()
    .min(1, "errContactMessageRequired")
    .max(1000, "errContactMessageLength"),
});
