import { z } from "zod";
import { FEEDBACK_TYPES } from "../configs/feedback.config";

const optionalEmail = z
  .string()
  .trim()
  .max(254, "errInvalidEmail")
  .refine(
    (value) => value === "" || z.email().safeParse(value).success,
    "errInvalidEmail",
  )
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
