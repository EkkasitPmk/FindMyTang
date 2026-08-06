import type {
  UpdateProfileResponse as ZodUpdateProfileResponse,
  ChangePasswordResponse as ZodChangePasswordResponse,
} from "../schemas/account.response.schema";

export type {
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../schemas/account.request.schema";

export type UpdateProfileResponse = ZodUpdateProfileResponse;

export type ChangePasswordResponse = ZodChangePasswordResponse;
