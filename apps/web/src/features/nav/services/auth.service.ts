import http from "@/shared/lib/api/http";
import { UserProfile } from "../types/auth.type";

export const getMeApi = async (): Promise<UserProfile> => {
  const response = await http.get<UserProfile>("/auth/me");
  return response.data;
};

export const logoutApi = async (): Promise<{ success: boolean }> => {
  const response = await http.post<{ success: boolean }>("/auth/logout");
  return response.data;
};
