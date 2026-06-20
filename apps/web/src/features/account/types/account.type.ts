export interface UpdateProfileRequest {
  displayName?: string;
  avatarUrl?: string;
  language?: string;
  timezone?: string;
}

export interface UpdateProfileResponse {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl?: string | null;
  language: string;
  timezone: string;
}
