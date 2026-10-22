import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RecurringUpcomingAlert from "./RecurringUpcomingAlert";
import {
  RecurringCycle,
  RecurringStatus,
  RecurringExpense,
} from "@/shared/lib/types/recurring.type";
import { useRecurringLogModalStore } from "../hooks/recurring-sheet.hook";
import { addDays, subDays } from "date-fns";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    locale: "en-US",
    t: (key: string) => {
      const map: Record<string, string> = {
        recurringUpcomingAlert: "{name} renews in {days} days ({amount})",
        recurringUpcomingAlertToday: "{name} renews today ({amount})",
        recurringOverdueAlert: "{name} is overdue by {days} days ({amount})",
        recurringLogExpense: "Log Expense",
      };
      return map[key] || key;
    },
  }),
}));

describe("RecurringUpcomingAlert", () => {
  it("renders null when item is null", () => {
    const { container } = render(<RecurringUpcomingAlert item={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders upcoming alert text and triggers openLog on click", () => {
    const openLogSpy = vi.fn();
    useRecurringLogModalStore.setState({ open: openLogSpy });

    const upcomingItem: RecurringExpense = {
      id: "rec-1",
      name: "Netflix",
      amount: 419,
      currency: "THB",
      billingCycle: RecurringCycle.MONTHLY,
      firstBillingDate: "2026-09-22T00:00:00.000Z",
      nextBillingDate: addDays(new Date(), 3).toISOString(),
      status: RecurringStatus.ACTIVE,
      createdAt: "",
      updatedAt: "",
    };

    render(<RecurringUpcomingAlert item={upcomingItem} />);

    expect(
      screen.getByText("Netflix renews in 3 days (฿419.00)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Log Expense")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(openLogSpy).toHaveBeenCalledWith(upcomingItem);
  });

  it("renders overdue alert when payment is overdue", () => {
    const overdueItem: RecurringExpense = {
      id: "rec-2",
      name: "Spotify",
      amount: 139,
      currency: "THB",
      billingCycle: RecurringCycle.MONTHLY,
      firstBillingDate: "2026-09-15T00:00:00.000Z",
      nextBillingDate: subDays(new Date(), 2).toISOString(),
      status: RecurringStatus.ACTIVE,
      createdAt: "",
      updatedAt: "",
    };

    render(<RecurringUpcomingAlert item={overdueItem} />);

    expect(
      screen.getByText("Spotify is overdue by 2 days (฿139.00)"),
    ).toBeInTheDocument();
  });
});
