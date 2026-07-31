import { APP_VERSION } from "@/shared/lib/configs/app.config";
import { WEB3FORMS_SUBMIT_URL } from "../configs/feedback.config";
import type { FeedbackFormValues } from "../types/feedback.type";

interface FeedbackContext {
  language: string;
  isGuest: boolean;
}

export const submitFeedback = async (
  values: FeedbackFormValues,
  context: FeedbackContext,
  signal?: AbortSignal,
): Promise<void> => {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("Web3Forms access key is not configured");
  }

  const formData = new FormData();
  formData.append("access_key", accessKey);
  formData.append("subject", `[FindMyTang Feedback][${values.type}]`);
  formData.append("feedback_type", values.type);
  formData.append("message", values.message);
  formData.append("app_version", APP_VERSION);
  formData.append("language", context.language);
  formData.append("mode", context.isGuest ? "Guest" : "Member");
  formData.append("botcheck", "");

  if (values.email) formData.append("email", values.email);

  const response = await fetch(WEB3FORMS_SUBMIT_URL, {
    method: "POST",
    body: formData,
    signal,
  });
  const data = (await response.json()) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Feedback submission failed");
  }
};
