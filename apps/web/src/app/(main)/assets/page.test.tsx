import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/assets/containers/AssetsRouteContainer", () => ({
  default: vi.fn(),
}));

import AssetPageSkeleton from "@/features/assets/components/AssetPageSkeleton";
import ManageAssetsSkeleton from "@/features/assets/components/ManageAssetsSkeleton";
import AssetsRouteContainer from "@/features/assets/containers/AssetsRouteContainer";
import AssetsPage from "./page";

describe("AssetsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the Manage Assets fallback when no asset id is present", async () => {
    const page = await AssetsPage({ searchParams: Promise.resolve({}) });

    expect(page.props.fallback.type).toBe(ManageAssetsSkeleton);
    expect(page.props.children.type).toBe(AssetsRouteContainer);
    expect(page.props.children.props.assetId).toBeUndefined();
  });

  it("uses the Asset Detail fallback when an asset id is present", async () => {
    const page = await AssetsPage({
      searchParams: Promise.resolve({ id: "asset-1" }),
    });

    expect(page.props.fallback.type).toBe(AssetPageSkeleton);
    expect(page.props.children.props.assetId).toBe("asset-1");
  });
});
