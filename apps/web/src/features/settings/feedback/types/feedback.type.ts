import type { z } from "zod";
import { feedbackFormSchema } from "../schemas/feedback.form.schema";

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
