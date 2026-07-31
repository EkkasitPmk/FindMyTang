import type { z } from "zod";
import { contactFormSchema } from "../schemas/contact.form.schema";

export type ContactFormValues = z.infer<typeof contactFormSchema>;
