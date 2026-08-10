import type { QueryClient } from "@tanstack/react-query";
import type { UserProfile } from "@/shared/lib/types/user.type";

export async function syncProfileCache(
  queryClient: QueryClient,
  profile?: UserProfile,
) {
  if (profile) {
    queryClient.setQueryData(["auth", "me"], profile);
  }
  await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
}
