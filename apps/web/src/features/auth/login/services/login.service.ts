import http from "@/shared/lib/api/http";
import { LoginRequest, LoginResponse } from "../types/login.type";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>("/auth/login", data);
  return response.data;
};
