import http from "@/shared/lib/api/http";
import { SyncGuestRequest, SyncGuestResponse } from "../types/auth.type";
import { syncGuestResponseSchema } from "../schemas/auth.response.schema";

export const authService = {
  syncGuest: async (data: SyncGuestRequest): Promise<SyncGuestResponse> => {
    const response = await http.post<SyncGuestResponse>(
      "/auth/sync-guest",
      data,
    );
    return syncGuestResponseSchema.parse(response.data);
  },
};
