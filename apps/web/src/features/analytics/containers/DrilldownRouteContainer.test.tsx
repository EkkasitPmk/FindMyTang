import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/features/assets/services/assets.server", () => ({
  getAssetsServer: vi.fn(),
}));
vi.mock("../services/analytics.server", () => ({
  getDrilldownServer: vi.fn(),
}));
vi.mock("./DrilldownContainer", () => ({ DrilldownContainer: vi.fn() }));

import { cookies } from "next/headers";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getDrilldownServer } from "../services/analytics.server";
import { DrilldownContainer } from "./DrilldownContainer";
import DrilldownRouteContainer from "./DrilldownRouteContainer";

const drilldown = {
  category: { id: "category-1", name: "Food", color: "#000", icon: null },
  summary: {
    currentMonth: 25,
    previousMonth: 10,
    percentageChange: 150,
    percentageOfTotal: 100,
  },
  transactions: [],
};

describe("DrilldownRouteContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({ has: () => true } as never);
    vi.mocked(getDrilldownServer).mockResolvedValue(drilldown as never);
    vi.mocked(getAssetsServer).mockResolvedValue([] as never);
  });

  it("keeps Guests in the Client/Dexie fallback", async () => {
    vi.mocked(cookies).mockResolvedValue({ has: () => false } as never);

    const page = await DrilldownRouteContainer({
      categoryId: "category-1",
      month: 8,
      year: 2026,
    });

    expect(page.type).toBe(DrilldownContainer);
    expect(getDrilldownServer).not.toHaveBeenCalled();
    expect(getAssetsServer).not.toHaveBeenCalled();
  });

  it("preloads matching drilldown data and active assets", async () => {
    const page = await DrilldownRouteContainer({
      categoryId: "category-1",
      month: 8,
      year: 2026,
    });

    expect(getDrilldownServer).toHaveBeenCalledWith("category-1", 8, 2026);
    expect(getAssetsServer).toHaveBeenCalledWith();
    expect(page.props.initialDrilldown).toBe(drilldown);
  });

  it("throws when authenticated drilldown data is unavailable", async () => {
    vi.mocked(getDrilldownServer).mockResolvedValue(null);

    await expect(
      DrilldownRouteContainer({
        categoryId: "category-1",
        month: 8,
        year: 2026,
      }),
    ).rejects.toThrow("Failed to load authenticated analytics drilldown data");
  });
});
