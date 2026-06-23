export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl?: string | null;
  language: string;
  lastSyncedAt?: string | null;
  lastSyncStatus?: "SUCCESS" | "FAILED" | null;
}
