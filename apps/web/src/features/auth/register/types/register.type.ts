import { RegisterResponse as ZodRegisterResponse } from "../../schemas/auth.response.schema";

export interface RegisterRequest {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export type RegisterResponse = ZodRegisterResponse;
