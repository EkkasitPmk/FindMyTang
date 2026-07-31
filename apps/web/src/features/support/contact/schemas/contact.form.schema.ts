import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "errContactNameRequired"),
  email: z
    .string()
    .trim()
    .min(1, "errContactEmailRequired")
    .pipe(z.email("errContactEmailInvalid")),
  phone: z.string().trim().min(1, "errContactPhoneRequired"),
  message: z.string().trim().min(1, "errContactMessageRequired"),
});
