import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { cookies } from "next/headers";
import { getCategoriesServer } from "./category.server";

const mockCookies = vi.mocked(cookies);
const categories = [
  { id: "category-1", name: "Food", type: "EXPENSE", deletedAt: null },
];

describe("category.server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("does not read cloud categories without an access token", async () => {
    mockCookies.mockResolvedValue({ has: () => false } as never);

    await expect(getCategoriesServer(true)).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("forwards cookies, uses no-store, and validates the list", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => categories,
    } as Response);

    await expect(getCategoriesServer(true)).resolves.toMatchObject(categories);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/categories?includeDeleted=true"),
      expect.objectContaining({
        cache: "no-store",
        headers: { cookie: "access_token=token" },
      }),
    );
  });

  it("returns null for an unavailable authenticated category read", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    await expect(getCategoriesServer(false)).resolves.toBeNull();
  });
});
