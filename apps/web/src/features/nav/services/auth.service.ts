import http from "@/shared/lib/api/http";
import { UserProfile } from "@/shared/lib/types/user.type";
import {
  navUserProfileResponseSchema,
  navLogoutResponseSchema,
  NavLogoutResponse,
} from "../schemas/nav.response.schema";

export const getMeApi = async (): Promise<UserProfile> => {
  const response = await http.get<UserProfile>("/auth/me");
  return navUserProfileResponseSchema.parse(response.data);
};

export const logoutApi = async (): Promise<NavLogoutResponse> => {
  const response = await http.post<NavLogoutResponse>("/auth/logout");
  return navLogoutResponseSchema.parse(response.data);
};
