import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import TransactionAssetList, {
  EXTERNAL_ASSET_ID,
} from "./TransactionAssetList";
import { AssetType, type Asset } from "@/shared/lib/types/asset.type";
import {
  RECENT_ASSET_IDS_KEY,
  getRecentAssetIds,
} from "../helpers/transaction.helper";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("TransactionAssetList", () => {
  const mockAssets: Asset[] = [
    {
      id: "asset-1",
      name: "Cash",
      type: AssetType.CASH,
      balance: 100,
      color: "#10B981",
      isArchived: false,
      includeInSnapshot: true,
      savingsAmount: 0,
    },
    {
      id: "asset-2",
      name: "Bank Account",
      type: AssetType.BANK,
      balance: 5000,
      color: "#3B82F6",
      isArchived: false,
      includeInSnapshot: true,
      savingsAmount: 0,
    },
    {
      id: "asset-3",
      name: "Crypto Wallet",
      type: AssetType.CRYPTO,
      balance: 20000,
      color: "#F59E0B",
      isArchived: false,
      includeInSnapshot: true,
      savingsAmount: 0,
    },
    {
      id: "asset-4",
      name: "Savings Account",
      type: AssetType.BANK,
      balance: 50000,
      color: "#8B5CF6",
      isArchived: false,
      includeInSnapshot: true,
      savingsAmount: 0,
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders empty state message when assets list is empty", () => {
    render(
      <TransactionAssetList
        assets={[]}
        activeAssetId={null}
        onSelectAsset={vi.fn()}
      />,
    );

    expect(screen.getByText("noAssetsFound")).toBeInTheDocument();
  });

  it("renders skeletons when isLoadingAssetList is true", () => {
    const { container } = render(
      <TransactionAssetList
        assets={mockAssets}
        activeAssetId="asset-1"
        onSelectAsset={vi.fn()}
        isLoadingAssetList
      />,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });

  it("renders assets sorted by 3 most recent asset IDs from localStorage on the far left", () => {
    // Seed recent assets: asset-3 was used most recently, then asset-4
    window.localStorage.setItem(
      RECENT_ASSET_IDS_KEY,
      JSON.stringify(["asset-3", "asset-4"]),
    );

    render(
      <TransactionAssetList
        assets={mockAssets}
        activeAssetId="asset-3"
        onSelectAsset={vi.fn()}
      />,
    );

    const assetButtons = screen
      .getAllByRole("button")
      .map((btn) => btn.textContent);

    // asset-3 and asset-4 should be rendered first (leftmost)
    expect(assetButtons[0]).toContain("Crypto Wallet");
    expect(assetButtons[1]).toContain("Savings Account");
    expect(assetButtons[2]).toContain("Cash");
    expect(assetButtons[3]).toContain("Bank Account");
  });

  it("calls onSelectAsset when clicked without writing to localStorage until save", () => {
    const handleSelectAsset = vi.fn();
    render(
      <TransactionAssetList
        assets={mockAssets}
        activeAssetId="asset-1"
        onSelectAsset={handleSelectAsset}
      />,
    );

    fireEvent.click(screen.getByText("Crypto Wallet"));

    expect(handleSelectAsset).toHaveBeenCalledWith("asset-3");
    // Should NOT record to recent assets on click alone
    expect(getRecentAssetIds()).toEqual([]);
  });

  it("renders transfer asset list, excludes activeAssetId, and calls onSelectAssetTo", () => {
    const handleSelectAsset = vi.fn();
    const handleSelectAssetTo = vi.fn();

    render(
      <TransactionAssetList
        assets={mockAssets}
        activeAssetId="asset-1"
        onSelectAsset={handleSelectAsset}
        activeAssetToId="asset-2"
        onSelectAssetTo={handleSelectAssetTo}
        transactionType="TRANSFER"
      />,
    );

    expect(screen.getByText("assetFrom")).toBeInTheDocument();
    expect(screen.getByText("assetTo")).toBeInTheDocument();
    expect(screen.getByText("externalAccount")).toBeInTheDocument();

    // Click on destination asset (e.g. Savings Account in the second list)
    const savingsAccounts = screen.getAllByText("Savings Account");
    fireEvent.click(savingsAccounts[1]);
    expect(handleSelectAssetTo).toHaveBeenCalledWith("asset-4");

    // Click on External Account
    fireEvent.click(screen.getByText("externalAccount"));
    expect(handleSelectAssetTo).toHaveBeenCalledWith(EXTERNAL_ASSET_ID);
    expect(getRecentAssetIds()).toEqual([]);
  });
});
