import { LoginResponse as ZodLoginResponse } from "../../schemas/auth.response.schema";

export interface LoginRequest {
  email?: string;
  password?: string;
}

export type LoginResponse = ZodLoginResponse;
