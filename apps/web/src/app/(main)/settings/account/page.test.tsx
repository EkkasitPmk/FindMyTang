import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/features/account/services/account.server", () => ({
  getCurrentUserServer: vi.fn(),
}));
vi.mock("@/features/account/containers/AccountContainer", () => ({
  default: vi.fn(),
}));

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountContainer from "@/features/account/containers/AccountContainer";
import { getCurrentUserServer } from "@/features/account/services/account.server";
import AccountPage from "./page";

const mockCookies = vi.mocked(cookies);
const mockRedirect = vi.mocked(redirect);
const mockGetCurrentUserServer = vi.mocked(getCurrentUserServer);

describe("AccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects Guests before reading account data", async () => {
    mockCookies.mockResolvedValue({ has: () => false } as never);
    mockRedirect.mockImplementation(() => {
      throw new Error("redirected");
    });

    await expect(AccountPage()).rejects.toThrow("redirected");
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
    expect(mockGetCurrentUserServer).not.toHaveBeenCalled();
  });

  it("renders the server-loaded profile for authenticated users", async () => {
    const user = {
      id: "user-1",
      email: "user@example.com",
      displayName: "User",
      avatarUrl: null,
      language: "en" as const,
    };
    mockCookies.mockResolvedValue({ has: () => true } as never);
    mockGetCurrentUserServer.mockResolvedValue(user as never);

    const page = await AccountPage();

    expect(page.type).toBe(AccountContainer);
    expect(page.props.initialUser).toBe(user);
  });

  it("throws for an unavailable authenticated profile", async () => {
    mockCookies.mockResolvedValue({ has: () => true } as never);
    mockGetCurrentUserServer.mockResolvedValue(null);

    await expect(AccountPage()).rejects.toThrow(
      "Failed to load authenticated account data",
    );
  });
});
