import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RecurringItemCard from "./RecurringItemCard";
import {
  RecurringCycle,
  RecurringExpense,
  RecurringStatus,
} from "@/shared/lib/types/recurring.type";

vi.mock("@/shared/lib/hooks/useCategories.hook", () => ({
  useCategories: () => ({
    data: [{ id: "cat-1", name: "Utilities", color: "#3B82F6", icon: "zap" }],
  }),
}));

vi.mock("@/shared/lib/hooks/useAssets.hook", () => ({
  useAssets: () => ({
    data: [{ id: "asset-1", name: "KBank" }],
  }),
}));

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        recurringCycleMonthly: "Monthly",
        recurringPerMonth: "/ month",
        recurringNextBillingLabel: "Next Billing",
        recurringCurrentCycle: "Current Cycle",
        recurringOldUnpaidBill: "Overdue Unpaid Bill",
        recurringLogThisBill: "Log this bill",
        recurringLogExpense: "Log Expense",
        recurringDueOverdue: "Overdue {days} days",
        recurringDueToday: "Today",
        delete: "Delete",
      };
      return map[key] || key;
    },
    locale: "en-US",
    currentLanguage: "en",
  }),
}));

describe("RecurringItemCard", () => {
  const baseItem: RecurringExpense = {
    id: "rec-1",
    name: "Internet Fiber",
    amount: 599,
    currency: "THB",
    billingCycle: RecurringCycle.MONTHLY,
    nextBillingDate: "2026-10-23T00:00:00.000Z",
    categoryId: "cat-1",
    assetId: "asset-1",
    status: RecurringStatus.ACTIVE,
    createdAt: "",
    updatedAt: "",
  };

  it("renders standard single cycle when only 1 cycle is due", () => {
    const handleLog = vi.fn();
    render(
      <RecurringItemCard
        item={baseItem}
        onEdit={vi.fn()}
        onToggleStatus={vi.fn()}
        onDelete={vi.fn()}
        onLogExpense={handleLog}
      />,
    );

    expect(screen.getByText("Internet Fiber")).toBeInTheDocument();
    expect(screen.queryByText("Overdue Unpaid Bill")).not.toBeInTheDocument();

    const logBtn = screen.getByText("Log Expense");
    fireEvent.click(logBtn);
    expect(handleLog).toHaveBeenCalledWith(baseItem, expect.any(String));
  });

  it("renders old unpaid bills banner when multiple past cycles are overdue", () => {
    const overdueMultipleItem: RecurringExpense = {
      ...baseItem,
      // 2 months in the past -> will have old cycle(s) + current cycle
      nextBillingDate: "2026-08-23T00:00:00.000Z",
    };

    const handleLog = vi.fn();
    render(
      <RecurringItemCard
        item={overdueMultipleItem}
        onEdit={vi.fn()}
        onToggleStatus={vi.fn()}
        onDelete={vi.fn()}
        onLogExpense={handleLog}
      />,
    );

    // Old unpaid bill alert should be displayed
    const oldBillBadges = screen.getAllByText("Overdue Unpaid Bill");
    expect(oldBillBadges.length).toBeGreaterThan(0);

    const logOldBtn = screen.getAllByText("Log this bill")[0];
    fireEvent.click(logOldBtn);

    // Should call onLogExpense with the old cycle date (starts with 2026-08-23)
    expect(handleLog).toHaveBeenCalledWith(
      overdueMultipleItem,
      expect.stringMatching(/^2026-08-23/),
    );
  });
});
