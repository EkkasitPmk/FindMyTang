import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RecurringAmountField from "./RecurringAmountField";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        recurringAmountLabel: "Amount",
        recurringAmountRequired: "Amount is required",
      };
      return map[key] || key;
    },
  }),
}));

describe("RecurringAmountField", () => {
  it("renders with currency prefix and handles value changes", () => {
    const handleChange = vi.fn();
    render(<RecurringAmountField value={150} onChange={handleChange} />);

    expect(screen.getByText("Amount (THB) *")).toBeInTheDocument();
    expect(screen.getByText("฿")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("0.00") as HTMLInputElement;
    expect(input.value).toBe("150");

    fireEvent.change(input, { target: { value: "299.99" } });
    expect(handleChange).toHaveBeenCalledWith(299.99);

    fireEvent.change(input, { target: { value: "" } });
    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("displays error message when error is true", () => {
    render(
      <RecurringAmountField
        value=""
        onChange={vi.fn()}
        error={true}
        errorMessage="Amount is required"
      />,
    );

    expect(screen.getByText("Amount is required")).toBeInTheDocument();
  });
});
