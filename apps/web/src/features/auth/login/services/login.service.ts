import http from "@/shared/lib/api/http";
import { LoginRequest, LoginResponse } from "../types/login.type";
import { loginResponseSchema } from "../../schemas/auth.response.schema";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>("/auth/login", data);
  return loginResponseSchema.parse(response.data);
};
