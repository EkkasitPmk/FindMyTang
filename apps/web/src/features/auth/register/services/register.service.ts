import http from "@/shared/lib/api/http";
import { RegisterRequest, RegisterResponse } from "../types/register.type";

export const registerApi = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await http.post<RegisterResponse>("/auth/register", data);
  return response.data;
};
