import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardRecurringAlert from "./DashboardRecurringAlert";
import {
  RecurringCycle,
  RecurringStatus,
  type RecurringExpense,
} from "@/shared/lib/types/recurring.type";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === "recurringUpcomingAlert") {
        return "{name} renews in {days} days ({amount})";
      }
      return key;
    },
    locale: "en-US",
  }),
}));

vi.mock("@/features/recurring/hooks/useRecurring.hook", () => ({
  useRecurringExpensesQuery: (
    _status: unknown,
    options?: { initialData?: RecurringExpense[] },
  ) => ({
    data: options?.initialData ?? [],
  }),
}));

vi.mock("@/features/recurring/components/RecurringLogModal", () => ({
  default: () => <div data-testid="recurring-log-modal" />,
}));

describe("DashboardRecurringAlert", () => {
  it("renders nothing when there are no upcoming or overdue items", () => {
    const { container } = render(<DashboardRecurringAlert initialItems={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the upcoming alert when an item is due within 7 days", () => {
    const today = new Date();
    const upcomingDate = new Date(today);
    upcomingDate.setDate(today.getDate() + 2);

    const items: RecurringExpense[] = [
      {
        id: "rec-1",
        name: "Netflix",
        amount: 350,
        billingCycle: RecurringCycle.MONTHLY,
        firstBillingDate: today.toISOString(),
        nextBillingDate: upcomingDate.toISOString(),
        status: RecurringStatus.ACTIVE,
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
      },
    ];

    render(<DashboardRecurringAlert initialItems={items} />);
    expect(screen.getByText(/Netflix/)).toBeInTheDocument();
  });
});
