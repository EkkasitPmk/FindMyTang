import http from "@/shared/lib/api/http";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/account.type";

export const updateProfileApi = async (
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  const response = await http.patch<UpdateProfileResponse>(
    "/users/profile",
    data,
  );
  return response.data;
};

export const changePasswordApi = async (
  data: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  const response = await http.post<ChangePasswordResponse>(
    "/users/change-password",
    data,
  );
  return response.data;
};

export const deleteAccountApi = async (): Promise<void> => {
  await http.delete("/users");
};
