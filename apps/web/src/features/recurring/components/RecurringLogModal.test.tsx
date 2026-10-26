import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RecurringLogModal from "./RecurringLogModal";
import { useRecurringLogModalStore } from "../hooks/recurring-sheet.hook";
import {
  RecurringCycle,
  RecurringExpense,
  RecurringStatus,
} from "@/shared/lib/types/recurring.type";

const mockMutate = vi.fn();
vi.mock("../hooks/useRecurring.hook", () => ({
  useLogRecurringExpenseMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

vi.mock("@/shared/lib/hooks/useAssets.hook", () => ({
  useAssets: () => ({
    data: [
      { id: "asset-1", name: "KBank", balance: 5000, type: "BANK" },
      { id: "asset-2", name: "SCB", balance: 2500, type: "BANK" },
    ],
  }),
}));

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        recurringLogModalTitle: "Log Recurring Expense",
        recurringLogModalDesc: "Record this payment",
        recurringNextBillingLabel: "Next Billing",
        recurringPaymentDate: "Payment Date",
        recurringAssetLabel: "Payment Account",
        recurringLogModalConfirm: "Confirm & Log",
        description: "DESCRIPTION",
        addANote: "Add a note",
        cancel: "Cancel",
      };
      return map[key] || key;
    },
    currentLanguage: "en",
    locale: "en-US",
  }),
}));

describe("RecurringLogModal", () => {
  const sampleItem: RecurringExpense = {
    id: "rec-123",
    name: "Netflix Premium",
    amount: 419,
    currency: "THB",
    billingCycle: RecurringCycle.MONTHLY,
    nextBillingDate: "2026-10-23T00:00:00.000Z",
    categoryId: "cat-1",
    assetId: "asset-1",
    status: RecurringStatus.ACTIVE,
    note: "Family plan shared with friends",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };

  it("pre-fills description from itemToLog.note", () => {
    useRecurringLogModalStore.setState({
      isOpen: true,
      itemToLog: sampleItem,
    });

    render(<RecurringLogModal />);

    const nameEl = screen.getByText("Netflix Premium");
    expect(nameEl).toBeInTheDocument();
    expect(nameEl.className).not.toContain("truncate");
    const descTextarea = screen.getByPlaceholderText("Add a note");
    expect(descTextarea).toHaveValue("Family plan shared with friends");
  });

  it("submits edited description when logging payment", () => {
    useRecurringLogModalStore.setState({
      isOpen: true,
      itemToLog: sampleItem,
    });

    render(<RecurringLogModal />);

    const descTextarea = screen.getByPlaceholderText("Add a note");
    fireEvent.change(descTextarea, {
      target: { value: "Updated note for October payment" },
    });

    const submitBtn = screen.getByText("Confirm & Log");
    fireEvent.click(submitBtn);

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        item: sampleItem,
        payload: expect.objectContaining({
          amount: 419,
          note: "Updated note for October payment",
        }),
      }),
      expect.anything(),
    );
  });

  it("logs old bill cycle with targetBillingDate and advances nextBillingDate accordingly", () => {
    useRecurringLogModalStore.setState({
      isOpen: true,
      itemToLog: sampleItem,
      targetBillingDate: "2026-09-01T00:00:00.000Z",
    });

    render(<RecurringLogModal />);

    const submitBtn = screen.getByText("Confirm & Log");
    fireEvent.click(submitBtn);

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        item: sampleItem,
        payload: expect.objectContaining({
          nextBillingDate: expect.stringMatching(/^2026-10-01/),
        }),
      }),
      expect.anything(),
    );
  });

  it("initializes paymentDate to the current time when opening modal", () => {
    vi.useFakeTimers();
    const mockNow = new Date("2026-10-27T14:35:20.000Z");
    vi.setSystemTime(mockNow);

    useRecurringLogModalStore.setState({
      isOpen: true,
      itemToLog: sampleItem,
      targetBillingDate: "2026-09-01T00:00:00.000Z",
    });

    render(<RecurringLogModal />);

    const submitBtn = screen.getByText("Confirm & Log");
    fireEvent.click(submitBtn);

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          paymentDate: mockNow.toISOString(),
        }),
      }),
      expect.anything(),
    );

    vi.useRealTimers();
  });
});
