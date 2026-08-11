import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { cookies } from "next/headers";
import {
  getCategoryBreakdownServer,
  getDrilldownServer,
  getMonthlyTrendsServer,
} from "./analytics.server";

const mockCookies = vi.mocked(cookies);
const categoryBreakdown = {
  summary: { income: 0, expense: 25, transfer: 0, adjust: 0, net: -25 },
  breakdown: [],
};

describe("analytics.server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("does not read cloud analytics without an access token", async () => {
    mockCookies.mockResolvedValue({ has: () => false } as never);

    await expect(
      getCategoryBreakdownServer(8, 2026, "EXPENSE"),
    ).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("forwards request cookies, disables cache, and validates responses", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => categoryBreakdown,
    } as Response);

    await expect(
      getCategoryBreakdownServer(7, 2026, "INCOME"),
    ).resolves.toEqual(categoryBreakdown);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "/analytics/categories?month=7&year=2026&type=INCOME",
      ),
      expect.objectContaining({
        cache: "no-store",
        headers: { cookie: "access_token=token" },
      }),
    );
  });

  it("returns null when an authenticated drilldown request fails", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);

    await expect(getDrilldownServer("category-1", 8, 2026)).resolves.toBeNull();
  });

  it("returns null when an authenticated response fails schema validation", async () => {
    mockCookies.mockResolvedValue({
      has: () => true,
      toString: () => "access_token=token",
    } as never);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ months: "invalid" }),
    } as Response);

    await expect(getMonthlyTrendsServer(2030)).resolves.toBeNull();
  });
});
