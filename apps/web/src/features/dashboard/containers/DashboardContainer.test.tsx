import { describe, expect, it, vi, beforeEach } from "vitest";
import { Children, isValidElement } from "react";
import { cookies } from "next/headers";
import DashboardContainer from "./DashboardContainer";
import DashboardGuestContainer from "./DashboardGuestContainer";
import { getCurrentUserServer } from "@/features/account/services/account.server";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getThisMonthSummaryServer } from "@/features/dashboard/services/summary.server";
import { getRecentTransactionsServer } from "@/features/transactions/services/transactions.server";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/features/account/services/account.server", () => ({
  getCurrentUserServer: vi.fn(),
}));
vi.mock("@/features/assets/services/assets.server", () => ({
  getAssetsServer: vi.fn(),
}));
vi.mock("@/features/dashboard/services/summary.server", () => ({
  getThisMonthSummaryServer: vi.fn(),
}));
vi.mock("@/features/transactions/services/transactions.server", () => ({
  getRecentTransactionsServer: vi.fn(),
}));

const mockCookies = vi.mocked(cookies);
const mockGetCurrentUserServer = vi.mocked(getCurrentUserServer);
const mockGetAssetsServer = vi.mocked(getAssetsServer);
const mockGetThisMonthSummaryServer = vi.mocked(getThisMonthSummaryServer);
const mockGetRecentTransactionsServer = vi.mocked(getRecentTransactionsServer);

describe("DashboardContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the client fallback without server reads for guests", async () => {
    mockCookies.mockResolvedValue({ has: () => false } as never);

    const dashboard = await DashboardContainer();
    const [, content] = Children.toArray(dashboard.props.children);

    if (!isValidElement(content)) throw new Error("Missing guest fallback");
    expect(content.type).toBe(DashboardGuestContainer);
    expect(mockGetCurrentUserServer).not.toHaveBeenCalled();
    expect(mockGetAssetsServer).not.toHaveBeenCalled();
    expect(mockGetThisMonthSummaryServer).not.toHaveBeenCalled();
    expect(mockGetRecentTransactionsServer).not.toHaveBeenCalled();
  });

  it("fails the route when authenticated dashboard data is unavailable", async () => {
    mockCookies.mockResolvedValue({ has: () => true } as never);
    mockGetCurrentUserServer.mockResolvedValue({ id: "user-1" } as never);
    mockGetAssetsServer.mockResolvedValue(null);
    mockGetThisMonthSummaryServer.mockResolvedValue({
      income: 0,
      expense: 0,
      net: 0,
      totalNetWorth: 0,
    });
    mockGetRecentTransactionsServer.mockResolvedValue({
      items: [],
      meta: { page: 1, totalPages: 1, total: 0 },
    } as never);

    await expect(DashboardContainer()).rejects.toThrow(
      "Failed to load authenticated dashboard data",
    );
  });
});
