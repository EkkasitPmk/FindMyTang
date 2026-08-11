import { cookies } from "next/headers";
import { cache } from "react";
import { BACKEND_URL } from "@/shared/lib/configs/backend.config";
import { userSchema } from "@/shared/lib/schemas/user.schema";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "../types/account.type";
import {
  changePasswordResponseSchema,
  updateProfileResponseSchema,
} from "../schemas/account.response.schema";

type BackendError = {
  code?: string;
  field?: string;
  message?: string | string[];
};

export type AccountActionResult<T = undefined> =
  | { success: true; data?: T }
  | {
      success: false;
      message: string;
      code?: string;
      field?: string;
      fieldErrors?: Record<string, string>;
    };

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

const getErrorMessage = (payload: BackendError | null, fallback: string) => {
  const message = payload?.message;
  return Array.isArray(message) ? message[0] || fallback : message || fallback;
};

const parseError = async (response: Response, fallback: string) => {
  let payload: BackendError | null = null;
  try {
    payload = (await response.json()) as BackendError;
  } catch {
    // Keep the stable fallback when the backend does not return JSON.
  }
  return {
    message: getErrorMessage(payload, fallback),
    code: payload?.code,
    field: payload?.field,
  };
};

export const getCurrentUserServer = cache(
  async function getCurrentUserServer() {
    try {
      const cookieHeader = await getCookieHeader();
      if (!cookieHeader) return null;

      const response = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        headers: { cookie: cookieHeader },
        cache: "no-store",
      });

      if (!response.ok) return null;
      return userSchema.parse(await response.json());
    } catch (error) {
      console.error("Failed to load current user on the server", error);
      return null;
    }
  },
);

export async function updateProfileServer(
  data: UpdateProfileRequest,
): Promise<
  AccountActionResult<ReturnType<typeof updateProfileResponseSchema.parse>>
> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/users/profile`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie: await getCookieHeader(),
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        ...(await parseError(response, "Failed to update profile")),
      };
    }

    return {
      success: true,
      data: updateProfileResponseSchema.parse(await response.json()),
    };
  } catch (error) {
    console.error("Failed to update profile on the server", error);
    return { success: false, message: "Failed to update profile" };
  }
}

export async function changePasswordServer(
  data: ChangePasswordRequest,
): Promise<
  AccountActionResult<ReturnType<typeof changePasswordResponseSchema.parse>>
> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/users/change-password`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: await getCookieHeader(),
        },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        success: false,
        ...(await parseError(response, "Failed to change password")),
      };
    }

    return {
      success: true,
      data: changePasswordResponseSchema.parse(await response.json()),
    };
  } catch (error) {
    console.error("Failed to change password on the server", error);
    return { success: false, message: "Failed to change password" };
  }
}

export async function deleteAccountServer(): Promise<AccountActionResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/users`, {
      method: "DELETE",
      headers: { cookie: await getCookieHeader() },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        ...(await parseError(response, "Failed to delete account")),
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete account on the server", error);
    return { success: false, message: "Failed to delete account" };
  }
}
