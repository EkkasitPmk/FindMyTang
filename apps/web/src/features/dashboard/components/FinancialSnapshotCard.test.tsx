import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: "en-US",
  }),
}));

import FinancialSnapshotCard from "./FinancialSnapshotCard";

describe("FinancialSnapshotCard", () => {
  it("renders matching skeleton layout when loading", () => {
    const { container } = render(
      <FinancialSnapshotCard
        netWorth={10000}
        income={5000}
        expense={2000}
        transfer={1000}
        adjustment={0}
        netChange={3000}
        hasAssets={true}
        isPrivate={false}
        onTogglePrivacy={vi.fn()}
        isLoading={true}
      />,
    );

    // Outer card uses py-4.5 instead of p-4.5 to allow split cards to bleed to the edge with px-4.5
    const outerCard = container.querySelector(".rounded-xl.border");
    expect(outerCard).toHaveClass("py-4.5");
    expect(outerCard).not.toHaveClass("p-4.5");

    // Cash flow split cards container has px-4.5
    const splitCardsContainer = container.querySelector(".overflow-x-auto");
    expect(splitCardsContainer).toHaveClass("px-4.5");

    // Split cards skeletons have h-15 w-[42%] matching CashFlowCard height and responsive width
    const cardSkeletons = container.querySelectorAll(
      ".overflow-x-auto .w-\\[42\\%\\]",
    );
    expect(cardSkeletons).toHaveLength(4);
    expect(cardSkeletons[0]).toHaveClass("h-15");
  });

  it("renders cash flow cards and handles privacy toggle when loaded", () => {
    const togglePrivacy = vi.fn();
    render(
      <FinancialSnapshotCard
        netWorth={15000}
        income={7000}
        expense={3000}
        transfer={1500}
        adjustment={500}
        netChange={4000}
        hasAssets={true}
        isPrivate={false}
        onTogglePrivacy={togglePrivacy}
        isLoading={false}
      />,
    );

    expect(screen.getByText("฿ 15,000.00")).toBeInTheDocument();

    const privacyButton = screen.getByRole("button", { name: "Hide balance" });
    fireEvent.click(privacyButton);
    expect(togglePrivacy).toHaveBeenCalled();
  });
});
