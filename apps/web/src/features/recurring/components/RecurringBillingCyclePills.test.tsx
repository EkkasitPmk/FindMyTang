import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecurringBillingCyclePills } from "./RecurringBillingCyclePills";
import { RecurringCycle } from "@/shared/lib/types/recurring.type";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        recurringCycleLabel: "Billing Cycle",
        recurringCycleWeekly: "Weekly",
        recurringCycleMonthly: "Monthly",
        recurringCycleQuarterly: "Quarterly",
        recurringCycleYearly: "Yearly",
      };
      return map[key] || key;
    },
  }),
}));

describe("RecurringBillingCyclePills", () => {
  it("renders 4 billing cycles and changes selection on click", () => {
    const handleChange = vi.fn();
    render(
      <RecurringBillingCyclePills
        value={RecurringCycle.MONTHLY}
        onChange={handleChange}
      />,
    );

    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Weekly")).toBeInTheDocument();
    expect(screen.getByText("Quarterly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yearly"));
    expect(handleChange).toHaveBeenCalledWith(RecurringCycle.YEARLY);
  });
});
