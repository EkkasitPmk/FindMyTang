import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = {
  toString: vi.fn(() => "access_token=test-token"),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
}));

import {
  changePasswordAction,
  deleteAccountAction,
  updateProfileAction,
  updateLanguageAction,
} from "./account.actions";
import { getCurrentUserServer } from "./account.server";

describe("account server boundary", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    cookieStore.toString.mockReturnValue("access_token=test-token");
    cookieStore.delete.mockClear();
  });

  it("loads and parses the authenticated user with forwarded cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "user-1",
          email: "user@example.com",
          displayName: "User",
          avatarUrl: null,
          language: "en",
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCurrentUserServer()).resolves.toMatchObject({
      id: "user-1",
      displayName: "User",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/auth/me"),
      expect.objectContaining({
        cache: "no-store",
        headers: { cookie: "access_token=test-token" },
      }),
    );
  });

  it("returns null for an unauthorized or unavailable session", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response(null, { status: 401 }))
        .mockRejectedValueOnce(new Error("network unavailable")),
    );

    await expect(getCurrentUserServer()).resolves.toBeNull();
    await expect(getCurrentUserServer()).resolves.toBeNull();
  });

  it("clears Next auth cookies after a successful account delete", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );

    await expect(deleteAccountAction()).resolves.toEqual({ success: true });
    expect(cookieStore.delete).toHaveBeenCalledWith("access_token");
    expect(cookieStore.delete).toHaveBeenCalledWith("refresh_token");
  });

  it("rejects unsupported languages at the Server Action boundary", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(updateLanguageAction("fr")).resolves.toEqual({
      success: false,
      message: "Invalid language",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates profile and password payloads before backend requests", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      updateProfileAction({ displayName: "" }),
    ).resolves.toMatchObject({
      success: false,
      fieldErrors: { displayName: expect.any(String) },
    });
    await expect(
      changePasswordAction({
        currentPassword: "short",
        newPassword: "different",
        confirmNewPassword: "different",
      }),
    ).resolves.toMatchObject({ success: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
