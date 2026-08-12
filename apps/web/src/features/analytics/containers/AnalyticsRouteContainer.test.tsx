import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("../services/analytics.server", () => ({
  getCategoryBreakdownServer: vi.fn(),
}));
vi.mock("./AnalyticsContainer", () => ({ default: vi.fn() }));

import { cookies } from "next/headers";
import { getCategoryBreakdownServer } from "../services/analytics.server";
import AnalyticsContainer from "./AnalyticsContainer";
import AnalyticsRouteContainer from "./AnalyticsRouteContainer";

const breakdown = {
  summary: { income: 0, expense: 0, transfer: 0, adjust: 0, net: 0 },
  breakdown: [],
};

describe("AnalyticsRouteContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({ has: () => true } as never);
    vi.mocked(getCategoryBreakdownServer).mockResolvedValue(breakdown as never);
  });

  it("keeps Guests in the Client/Dexie fallback", async () => {
    vi.mocked(cookies).mockResolvedValue({ has: () => false } as never);

    const page = await AnalyticsRouteContainer();

    expect(page.type).toBe(AnalyticsContainer);
    expect(getCategoryBreakdownServer).not.toHaveBeenCalled();
  });

  it("preloads only the default expense breakdown", async () => {
    const page = await AnalyticsRouteContainer();

    expect(getCategoryBreakdownServer).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      "EXPENSE",
    );
    expect(page.props.initialCategoryBreakdown).toBe(breakdown);
  });

  it("throws when the authenticated initial read is unavailable", async () => {
    vi.mocked(getCategoryBreakdownServer).mockResolvedValue(null);

    await expect(AnalyticsRouteContainer()).rejects.toThrow(
      "Failed to load authenticated analytics data",
    );
  });
});
