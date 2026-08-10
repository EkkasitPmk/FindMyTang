import { describe, expect, it, vi } from "vitest";
import { syncProfileCache } from "./profile-cache.helper";

describe("syncProfileCache", () => {
  it("updates and invalidates every profile consumer query", async () => {
    const queryClient = {
      setQueryData: vi.fn(),
      invalidateQueries: vi.fn().mockResolvedValue(undefined),
    };
    const profile = {
      id: "user-1",
      email: "user@example.com",
      displayName: "Updated user",
      avatarUrl: "/avatars/avatar.png",
      language: "en" as const,
    };

    await syncProfileCache(queryClient as never, profile);

    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      ["auth", "me"],
      profile,
    );
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["auth", "me"],
    });
  });
});
