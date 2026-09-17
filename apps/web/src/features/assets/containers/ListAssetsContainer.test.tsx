import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const mockUseAssets = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/shared/lib/hooks/useAssets.hook", () => ({
  useAssets: () => mockUseAssets(),
}));
vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    locale: "en-US",
    t: (key: string) => key,
  }),
}));

import ListAssetsContainer from "./ListAssetsContainer";

describe("ListAssetsContainer", () => {
  it("renders skeleton header and items when assets are loading", () => {
    mockUseAssets.mockReturnValue({
      data: undefined,
      isPending: true,
    });

    const markup = renderToStaticMarkup(<ListAssetsContainer />);

    // Header skeleton
    expect(markup).toContain("h-6 w-28");
    expect(markup).toContain("size-6.5 rounded-full");
    // Not rendering real header
    expect(markup).not.toContain("assetsTitle");
    // Asset rows skeletons without ChevronRight
    expect(markup).toContain("size-4 rounded");
    expect(markup).not.toContain("lucide-chevron-right");
  });

  it("renders real header and active assets when loaded", () => {
    mockUseAssets.mockReturnValue({
      data: [
        {
          id: "asset-1",
          name: "Main Wallet",
          type: "CASH",
          balance: 1000,
          color: "#000",
          isArchived: false,
        },
      ],
      isPending: false,
    });

    const markup = renderToStaticMarkup(<ListAssetsContainer />);

    expect(markup).toContain("assetsTitle");
    expect(markup).toContain("Main Wallet");
  });
});
