import http from "@/shared/lib/api/http";
import { RegisterRequest, RegisterResponse } from "../types/register.type";
import { registerResponseSchema } from "../../schemas/auth.response.schema";

export const registerApi = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await http.post<RegisterResponse>("/auth/register", data);
  return registerResponseSchema.parse(response.data);
};
