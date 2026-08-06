"use server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  changePasswordRequestSchema,
  updateProfileRequestSchema,
} from "../schemas/account.request.schema";
import {
  changePasswordServer,
  deleteAccountServer,
  updateProfileServer,
  type AccountActionResult,
} from "./account.server";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../types/account.type";

const languageSchema = z.enum(["th", "en"]);

const validationError = (error: z.ZodError) => {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return {
    success: false as const,
    message: "Invalid account data",
    fieldErrors,
  };
};

export async function updateProfileAction(
  data: UpdateProfileRequest,
): Promise<AccountActionResult<UpdateProfileResponse>> {
  const parsed = updateProfileRequestSchema.safeParse(data);
  if (!parsed.success) return validationError(parsed.error);
  return updateProfileServer(parsed.data);
}

export async function changePasswordAction(
  data: ChangePasswordRequest,
): Promise<AccountActionResult<ChangePasswordResponse>> {
  const parsed = changePasswordRequestSchema.safeParse(data);
  if (!parsed.success) return validationError(parsed.error);
  return changePasswordServer(parsed.data);
}

export async function deleteAccountAction(): Promise<AccountActionResult> {
  const result = await deleteAccountServer();

  if (result.success) {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
  }

  return result;
}

export async function updateLanguageAction(
  language: string,
): Promise<AccountActionResult<UpdateProfileResponse>> {
  const parsedLanguage = languageSchema.safeParse(language);
  if (!parsedLanguage.success) {
    return { success: false, message: "Invalid language" };
  }
  return updateProfileServer({ language: parsedLanguage.data });
}
