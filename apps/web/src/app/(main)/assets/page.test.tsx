import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/features/assets/services/assets.server", () => ({
  getAssetsServer: vi.fn(),
}));
vi.mock("@/features/assets/containers/AssetDetailContainer", () => ({
  default: vi.fn(),
}));

import { cookies } from "next/headers";
import AssetDetailContainer from "@/features/assets/containers/AssetDetailContainer";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import AssetsPage from "./page";

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

describe("AssetsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies.mockResolvedValue({ has: () => true } as never);
    mockGetAssetsServer.mockResolvedValue(assets as never);
  });

  it("loads management assets including soft-deleted records", async () => {
    const page = await AssetsPage({ searchParams: Promise.resolve({}) });

    expect(mockGetAssetsServer).toHaveBeenCalledWith(true);
    expect(page.type).toBe(AssetDetailContainer);
    expect(page.props.initialIncludeDeleted).toBe(true);
  });

  it("loads only active assets for an asset detail URL", async () => {
    const page = await AssetsPage({
      searchParams: Promise.resolve({ id: "asset-1" }),
    });

    expect(mockGetAssetsServer).toHaveBeenCalledWith(false);
    expect(page.props.initialIncludeDeleted).toBe(false);
  });

  it("fails the route when an authenticated asset read is unavailable", async () => {
    mockGetAssetsServer.mockResolvedValue(null);

    await expect(AssetsPage({ searchParams: Promise.resolve({}) })).rejects.toThrow(
      "Failed to load authenticated assets",
    );
  });
});
