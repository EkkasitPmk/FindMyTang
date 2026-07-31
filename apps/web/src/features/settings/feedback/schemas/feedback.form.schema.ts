import { z } from "zod";
import { FEEDBACK_TYPES } from "../configs/feedback.config";

const optionalEmail = z
  .union([z.email("errInvalidEmail"), z.literal("")])
  .optional();

export const feedbackFormSchema = z.object({
  type: z.enum(FEEDBACK_TYPES, "errFeedbackTypeRequired"),
  message: z
    .string()
    .trim()
    .min(1, "errFeedbackMessageRequired")
    .max(1000, "errFeedbackMessageLength"),
  email: optionalEmail,
});
