import http from "@/shared/lib/api/http";
import { UpdateProfileRequest, UpdateProfileResponse } from "../types/account.type";

export const updateProfileApi = async (
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
  const response = await http.patch<UpdateProfileResponse>(
    "/users/profile",
    data,
  );
  return response.data;
};
