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

  it("does not render reveal button when excludedNetWorth is 0 or omitted", () => {
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
        onTogglePrivacy={vi.fn()}
        isLoading={false}
      />,
    );

    expect(screen.queryByText(/showHiddenBalance/)).not.toBeInTheDocument();
  });

  it("renders reveal button and toggles hidden balance breakdown when excludedNetWorth > 0", () => {
    render(
      <FinancialSnapshotCard
        netWorth={15000}
        excludedNetWorth={20000}
        income={7000}
        expense={3000}
        transfer={1500}
        adjustment={500}
        netChange={4000}
        hasAssets={true}
        isPrivate={false}
        onTogglePrivacy={vi.fn()}
        isLoading={false}
      />,
    );

    // Initial state: reveal button is present, breakdown is hidden
    const revealBtn = screen.getByRole("button", {
      name: /showHiddenBalance/,
    });
    expect(revealBtn).toBeInTheDocument();
    expect(revealBtn).toHaveTextContent("+฿ 20,000.00");
    expect(screen.queryByText("hiddenBalance")).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(revealBtn);
    expect(screen.getByText("hiddenBalance")).toBeInTheDocument();
    expect(screen.getByText("฿ 20,000.00")).toBeInTheDocument();
    expect(screen.getByText("totalWithHidden")).toBeInTheDocument();
    expect(screen.getByText("฿ 35,000.00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /hideHiddenBalance/ }),
    ).toBeInTheDocument();

    // Click to collapse
    const hideBtn = screen.getByRole("button", { name: /hideHiddenBalance/ });
    fireEvent.click(hideBtn);
    expect(
      screen.getByRole("button", { name: /showHiddenBalance/ }),
    ).toBeInTheDocument();
  });

  it("masks excluded amounts when isPrivate is true", () => {
    render(
      <FinancialSnapshotCard
        netWorth={15000}
        excludedNetWorth={20000}
        income={7000}
        expense={3000}
        transfer={1500}
        adjustment={500}
        netChange={4000}
        hasAssets={true}
        isPrivate={true}
        onTogglePrivacy={vi.fn()}
        isLoading={false}
      />,
    );

    const revealBtn = screen.getByRole("button", {
      name: /showHiddenBalance/,
    });
    expect(revealBtn).toHaveTextContent("******");

    fireEvent.click(revealBtn);
    expect(screen.getAllByText("฿******")).toHaveLength(2);
  });
});
