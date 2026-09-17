import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mockUseAssets = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/shared/lib/hooks/useAssets.hook", () => ({
  useAssets: () => mockUseAssets(),
}));
vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

import DashboardAssetHeader from "./DashboardAssetHeader";

describe("DashboardAssetHeader", () => {
  it("renders skeleton header when assets are pending", () => {
    mockUseAssets.mockReturnValue({
      data: undefined,
      isPending: true,
    });

    const markup = renderToStaticMarkup(<DashboardAssetHeader language="en" />);

    // Skeleton title and action button
    expect(markup).toContain("h-6 w-28");
    expect(markup).toContain("size-6.5 rounded-full");
    // Not rendering real text or icon
    expect(markup).not.toContain("assetsTitle");
    expect(markup).not.toContain("lucide-chevron-right");
    expect(markup).not.toContain("lucide-plus");
  });

  it("renders real title and plus button when assets are loaded", () => {
    mockUseAssets.mockReturnValue({
      data: [
        {
          id: "asset-1",
          name: "Wallet",
          type: "CASH",
          balance: 100,
          isArchived: false,
        },
      ],
      isPending: false,
    });

    const markup = renderToStaticMarkup(<DashboardAssetHeader language="en" />);

    expect(markup).toContain("Assets");
    expect(markup).toContain("lucide-plus");
  });
});
