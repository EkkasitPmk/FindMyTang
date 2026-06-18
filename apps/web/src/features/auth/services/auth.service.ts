import http from "@/shared/lib/api/http";
import { SyncGuestRequest, SyncGuestResponse } from "../types/auth.type";

export const authService = {
  syncGuest: async (data: SyncGuestRequest): Promise<SyncGuestResponse> => {
    const response = await http.post<SyncGuestResponse>(
      "/auth/sync-guest",
      data,
    );
    return response.data;
  },
};
