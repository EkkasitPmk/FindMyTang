import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
const mockUseAssets = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/shared/lib/hooks/useAssets.hook", () => ({
  useAssets: () => mockUseAssets(),
}));

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => (key === "seeAll" ? "See all" : key),
  }),
}));

import { AssetType } from "@/shared/lib/types/asset.type";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import DashboardAssetHeader from "./DashboardAssetHeader";

describe("DashboardAssetHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAssetUIStore.setState({ dashboardAssetView: "list" });
  });

  it("renders skeleton header when assets are pending", () => {
    mockUseAssets.mockReturnValue({
      data: undefined,
      isPending: true,
    });

    const { container } = render(<DashboardAssetHeader language="en" />);

    expect(container.querySelector(".h-6.w-28")).toBeInTheDocument();
    expect(container.querySelector(".h-4.w-16")).toBeInTheDocument();
    expect(container.querySelector(".h-6.w-14.rounded-lg")).toBeInTheDocument();
    expect(screen.queryByText("Assets")).not.toBeInTheDocument();
    expect(screen.queryByText("See all")).not.toBeInTheDocument();
  });

  it("renders real title and See all link when assets are loaded", () => {
    mockUseAssets.mockReturnValue({
      data: [
        {
          id: "asset-1",
          name: "Wallet",
          type: AssetType.CASH,
          balance: 100,
          isArchived: false,
        },
      ],
      isPending: false,
    });

    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
      })),
    );

    render(<DashboardAssetHeader language="en" />);

    expect(screen.getByText("Assets")).toBeInTheDocument();
    const seeAllLink = screen.getByRole("link", { name: /See all/i });
    expect(seeAllLink).toBeInTheDocument();
    expect(seeAllLink).toHaveAttribute("href", "/assets");
  });

  it("navigates to /settings?tab=assets on desktop when See all is clicked", () => {
    mockUseAssets.mockReturnValue({
      data: [
        { id: "asset-1", name: "Wallet", type: AssetType.CASH, balance: 100 },
      ],
      isPending: false,
    });

    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query === "(min-width: 1024px)",
      })),
    );

    render(<DashboardAssetHeader language="en" />);

    const seeAllLink = screen.getByRole("link", { name: /See all/i });
    fireEvent.click(seeAllLink);

    expect(mockPush).toHaveBeenCalledWith("/settings?tab=assets");
  });

  it("toggles dashboard asset view mode between list and grid", () => {
    mockUseAssets.mockReturnValue({
      data: [
        { id: "asset-1", name: "Wallet", type: AssetType.CASH, balance: 100 },
      ],
      isPending: false,
    });

    render(<DashboardAssetHeader language="en" />);

    const listViewButton = screen.getByRole("button", { name: "List view" });
    const gridViewButton = screen.getByRole("button", { name: "Grid view" });

    expect(listViewButton).toBeInTheDocument();
    expect(gridViewButton).toBeInTheDocument();
    expect(listViewButton).toHaveAttribute("aria-pressed", "true");
    expect(gridViewButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(gridViewButton);
    expect(useAssetUIStore.getState().dashboardAssetView).toBe("grid");

    fireEvent.click(listViewButton);
    expect(useAssetUIStore.getState().dashboardAssetView).toBe("list");
  });
});
