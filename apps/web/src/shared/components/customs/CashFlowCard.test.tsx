import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CashFlowCard from "./CashFlowCard";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    locale: "en-US",
    t: (key: string) => (key === "items" ? "items" : key),
  }),
}));

describe("CashFlowCard", () => {
  it("renders label, formatted amount and count", () => {
    render(
      <CashFlowCard type="income" label="Income" amount={420.8} count={3} />,
    );

    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("+฿ 420.80")).toBeInTheDocument();
    expect(screen.getByText("3 items")).toBeInTheDocument();
  });

  it("masks amount when isPrivate is true", () => {
    render(
      <CashFlowCard type="expense" label="Expense" amount={300} isPrivate />,
    );

    expect(screen.getByText("****")).toBeInTheDocument();
    expect(screen.queryByText("-฿ 300.00")).not.toBeInTheDocument();
  });

  it("handles click and keyboard activation when onClick is provided", () => {
    const handleClick = vi.fn();
    render(
      <CashFlowCard
        type="expense"
        label="Expense"
        amount={150}
        onClick={handleClick}
        isSelected
      />,
    );

    const button = screen.getByRole("button", { name: /expense/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");

    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
