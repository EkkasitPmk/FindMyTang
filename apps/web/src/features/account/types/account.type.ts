export interface UpdateProfileRequest {
  displayName?: string;
  avatarUrl?: string | null;
  language?: string;
}

export interface UpdateProfileResponse {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl?: string | null;
  language: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
