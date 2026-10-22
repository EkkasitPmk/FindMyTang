import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecurringDatePicker } from "./RecurringDatePicker";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/features/transactions/components/ChooseADate", () => ({
  default: () => <div data-testid="choose-a-date" />,
}));

describe("RecurringDatePicker", () => {
  const dummyDate = new Date("2026-10-23T00:00:00Z");

  it("does not render the today shortcut button when dueTodayLabel is omitted", () => {
    render(
      <RecurringDatePicker
        value={dummyDate}
        onChange={vi.fn()}
        label="Billing Date"
      />,
    );

    expect(screen.getByText("Billing Date *")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /today/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the today shortcut button when dueTodayLabel is provided", () => {
    render(
      <RecurringDatePicker
        value={dummyDate}
        onChange={vi.fn()}
        label="Payment Date"
        dueTodayLabel="Today"
      />,
    );

    expect(screen.getByText("Payment Date *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();
  });
});
