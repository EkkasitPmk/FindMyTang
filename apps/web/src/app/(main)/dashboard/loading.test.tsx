import { beforeEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { render } from "@testing-library/react";
import { useAssetUIStore } from "@/features/assets/hooks/assets.hook";
import DashboardLoading from "./loading";

describe("DashboardLoading", () => {
  beforeEach(() => {
    useAssetUIStore.setState({ dashboardAssetView: "list" });
  });

  it("renders pure skeletons without ChevronRight icons", () => {
    const markup = renderToStaticMarkup(<DashboardLoading />);

    // Profile header (mobile)
    expect(markup).toContain("bg-background fixed md:hidden top-0");
    // Financial snapshot split cards
    expect(markup).toContain("w-[42%]");
    // Assets header skeleton
    expect(markup).toContain("h-6 w-28");
    // 3 asset rows with skeleton blocks instead of icons
    expect(markup).toContain("border-l-4 border-border");
    // No action button or chevron icons
    expect(markup).not.toContain("size-6.5 rounded-full");
    expect(markup).not.toContain("lucide-chevron-right");
    // Recent journal section header skeleton
    expect(markup).toContain("h-6 w-32");
    expect(markup).toContain("h-4 w-16");
  });

  it("renders grid skeleton when dashboardAssetView is grid", () => {
    useAssetUIStore.setState({ dashboardAssetView: "grid" });
    const { container } = render(<DashboardLoading />);

    expect(container.querySelector(".grid.grid-cols-2")).toBeInTheDocument();
    expect(container.querySelector(".border-t-3")).toBeInTheDocument();
    expect(container.querySelector(".border-l-4")).not.toBeInTheDocument();
  });
});
