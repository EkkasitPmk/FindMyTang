import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import DashboardAssetList from "./DashboardAssetList";
import { AssetType, type Asset } from "@/shared/lib/types/asset.type";

const mockAssets: Asset[] = [
  {
    id: "asset-1",
    name: "Cash Wallet",
    type: AssetType.CASH,
    balance: 1500,
    color: "#22c55e",
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "asset-2",
    name: "My Savings",
    type: AssetType.BANK,
    balance: 50000,
    color: "#3b82f6",
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "asset-3",
    name: "Empty Card",
    type: AssetType.OTHER,
    balance: 0,
    color: "#6b7280",
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

vi.mock("@/shared/lib/hooks/useAssets.hook", () => ({
  useAssets: ({ initialData }: { initialData?: Asset[] }) => ({
    data: initialData,
    isPending: false,
  }),
}));

describe("DashboardAssetList", () => {
  beforeEach(() => {
    useAssetUIStore.setState({ dashboardAssetView: "list" });
  });

  it("renders list view by default with border-l-4 style and secondary-text for 0 balance", () => {
    const { container } = render(
      <DashboardAssetList assets={mockAssets} language="en" />,
    );

    expect(screen.getByText("Cash Wallet")).toBeInTheDocument();
    expect(screen.getByText("My Savings")).toBeInTheDocument();
    expect(screen.getByText("Empty Card")).toBeInTheDocument();
    expect(screen.getByText("฿0.00")).toHaveClass("text-secondary-text");
    expect(screen.getByText("฿1,500.00")).toHaveClass("text-primary-text");
    expect(container.querySelector(".space-y-1")).toBeInTheDocument();
    expect(
      container.querySelector(".grid.grid-cols-2"),
    ).not.toBeInTheDocument();
  });

  it("renders grid view with assetType when dashboardAssetView is grid and secondary-text for 0 balance", () => {
    useAssetUIStore.setState({ dashboardAssetView: "grid" });

    const { container } = render(
      <DashboardAssetList assets={mockAssets} language="en" />,
    );

    expect(screen.getByText("Cash Wallet")).toBeInTheDocument();
    expect(screen.getByText("My Savings")).toBeInTheDocument();
    expect(screen.getByText("Empty Card")).toBeInTheDocument();
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("Cash")).toHaveClass("text-secondary-text");
    expect(screen.getByText("฿0.00")).toHaveClass("text-secondary-text");
    expect(screen.getByText("฿1,500.00")).toHaveClass("text-primary-text");
    expect(container.querySelector(".grid.grid-cols-2")).toBeInTheDocument();
    expect(container.querySelector(".border-t-3")).toBeInTheDocument();
  });
});
