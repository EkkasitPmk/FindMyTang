import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("../services/assets.server", () => ({ getAssetsServer: vi.fn() }));
vi.mock("@/features/transactions/services/transactions.server", () => ({
  getAvailableDatesServer: vi.fn(),
}));
vi.mock("./AssetDetailContainer", () => ({ default: vi.fn() }));

import { cookies } from "next/headers";
import AssetDetailContainer from "./AssetDetailContainer";
import { getAssetsServer } from "../services/assets.server";
import { getAvailableDatesServer } from "@/features/transactions/services/transactions.server";
import AssetsRouteContainer from "./AssetsRouteContainer";

const mockCookies = vi.mocked(cookies);
const mockGetAssetsServer = vi.mocked(getAssetsServer);
const assets = [
  {
    id: "asset-1",
    name: "Cash",
    type: "CASH",
    balance: 100,
    isArchived: false,
  },
];

describe("AssetsRouteContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies.mockResolvedValue({ has: () => true } as never);
    mockGetAssetsServer.mockResolvedValue(assets as never);
    vi.mocked(getAvailableDatesServer).mockResolvedValue({
      "2026": ["August"],
    });
  });

  it("loads management assets including soft-deleted records", async () => {
    const page = await AssetsRouteContainer({});

    expect(mockGetAssetsServer).toHaveBeenCalledWith(true);
    expect(page.type).toBe(AssetDetailContainer);
    expect(page.props.initialIncludeDeleted).toBe(true);
  });

  it("loads only active assets for an asset detail URL", async () => {
    const page = await AssetsRouteContainer({ assetId: "asset-1" });

    expect(mockGetAssetsServer).toHaveBeenCalledWith(false);
    expect(getAvailableDatesServer).toHaveBeenCalledWith("asset-1");
    expect(page.props.initialIncludeDeleted).toBe(false);
    expect(page.props.initialAvailableDates).toEqual({ "2026": ["August"] });
  });

  it("fails when an authenticated asset read is unavailable", async () => {
    mockGetAssetsServer.mockResolvedValue(null);

    await expect(AssetsRouteContainer({})).rejects.toThrow(
      "Failed to load authenticated assets",
    );
  });
});
