import { APP_VERSION } from "@/shared/lib/configs/app.config";
import { WEB3FORMS_SUBMIT_URL } from "../configs/support.config";
import type { SupportContext, SupportRequest } from "../types/support.type";

export const submitSupportRequest = async (
  request: SupportRequest,
  context: SupportContext,
  signal?: AbortSignal,
): Promise<void> => {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("Web3Forms access key is not configured");
  }

  const formData = new FormData();
  formData.append("access_key", accessKey);
  formData.append("subject", request.subject);
  Object.entries(request.fields).forEach(([key, value]) =>
    formData.append(key, value),
  );
  formData.append("app_version", APP_VERSION);
  formData.append("language", context.language);
  formData.append("mode", context.isGuest ? "Guest" : "Member");
  formData.append("botcheck", "");

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
    throw new Error(data.message || "Support request failed");
  }
};
