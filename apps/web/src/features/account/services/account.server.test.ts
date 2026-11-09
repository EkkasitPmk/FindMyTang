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
import {
  getCurrentUserServer,
  updateProfileServer,
  changePasswordServer,
  deleteAccountServer,
} from "./account.server";

describe("account server boundary", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    cookieStore.toString.mockReturnValue("access_token=test-token");
    cookieStore.delete.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
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
    await expect(updateProfileAction({})).resolves.toMatchObject({
      success: false,
      message: "Invalid account data",
      fieldErrors: {},
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

  it("forwards valid profile updates to the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "user-1",
          email: "user@example.com",
          displayName: "New Name",
          avatarUrl: null,
          language: "en",
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await updateProfileAction({ displayName: "New Name" });

    expect(result).toMatchObject({
      success: true,
      data: { displayName: "New Name" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/users/profile"),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ displayName: "New Name" }),
      }),
    );
  });

  it("forwards valid password changes to the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: "Password changed successfully",
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const payload = {
      currentPassword: "OldPassword123",
      newPassword: "NewPassword12345",
      confirmNewPassword: "NewPassword12345",
    };
    const result = await changePasswordAction(payload);

    expect(result).toEqual({
      success: true,
      data: {
        success: true,
        message: "Password changed successfully",
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/users/change-password"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );
  });

  it("forwards supported language updates to the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "user-1",
          email: "user@example.com",
          displayName: "User",
          avatarUrl: null,
          language: "th",
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await updateLanguageAction("th");

    expect(result).toMatchObject({
      success: true,
      data: { language: "th" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/users/profile"),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ language: "th" }),
      }),
    );
  });

  it("does not delete auth cookies when account deletion fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 400 })),
    );

    const result = await deleteAccountAction();

    expect(result).toEqual({
      success: false,
      message: "Failed to delete account",
    });
    expect(cookieStore.delete).not.toHaveBeenCalled();
  });

  it("returns null when cookie header is empty without making a network request", async () => {
    cookieStore.toString.mockReturnValue("");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await getCurrentUserServer();

    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("parses structured backend errors with array messages and field info in updateProfileServer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: ["Display name must be under 25 characters"],
            code: "VALIDATION_FAILED",
            field: "displayName",
          }),
          { status: 400 },
        ),
      ),
    );

    const result = await updateProfileServer({
      displayName: "TooLongDisplayName",
    });

    expect(result).toEqual({
      success: false,
      message: "Display name must be under 25 characters",
      code: "VALIDATION_FAILED",
      field: "displayName",
    });
  });

  it("falls back to default error message when response is not JSON in updateProfileServer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<!DOCTYPE html><html>Server Error</html>", {
          status: 502,
          headers: { "content-type": "text/html" },
        }),
      ),
    );

    const result = await updateProfileServer({ displayName: "Valid" });

    expect(result).toEqual({
      success: false,
      message: "Failed to update profile",
      code: undefined,
      field: undefined,
    });
  });

  it("handles network failure gracefully in updateProfileServer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network boom")),
    );

    const result = await updateProfileServer({ displayName: "Valid" });

    expect(result).toEqual({
      success: false,
      message: "Failed to update profile",
    });
  });

  it("handles backend error in changePasswordServer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: "Current password does not match",
            code: "INVALID_CREDENTIALS",
          }),
          { status: 400 },
        ),
      ),
    );

    const result = await changePasswordServer({
      currentPassword: "OldPassword123",
      newPassword: "NewPassword12345",
      confirmNewPassword: "NewPassword12345",
    });

    expect(result).toEqual({
      success: false,
      message: "Current password does not match",
      code: "INVALID_CREDENTIALS",
      field: undefined,
    });
  });

  it("handles network failure gracefully in changePasswordServer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Connection reset")),
    );

    const result = await changePasswordServer({
      currentPassword: "OldPassword123",
      newPassword: "NewPassword12345",
      confirmNewPassword: "NewPassword12345",
    });

    expect(result).toEqual({
      success: false,
      message: "Failed to change password",
    });
  });

  it("falls back to default message when error payload has empty array in deleteAccountServer", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ message: [] }), { status: 400 }),
        ),
    );

    const result = await deleteAccountServer();

    expect(result).toEqual({
      success: false,
      message: "Failed to delete account",
      code: undefined,
      field: undefined,
    });
  });

  it("handles network failure gracefully in deleteAccountServer", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("DNS timeout")));

    const result = await deleteAccountServer();

    expect(result).toEqual({
      success: false,
      message: "Failed to delete account",
    });
  });
});
