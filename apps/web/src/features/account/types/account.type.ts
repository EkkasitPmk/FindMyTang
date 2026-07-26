import {
  UpdateProfileResponse as ZodUpdateProfileResponse,
  ChangePasswordResponse as ZodChangePasswordResponse,
} from "../schemas/account.response.schema";

export interface UpdateProfileRequest {
  displayName?: string;
  avatarUrl?: string | null;
  language?: string;
}

export type UpdateProfileResponse = ZodUpdateProfileResponse;

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export type ChangePasswordResponse = ZodChangePasswordResponse;
