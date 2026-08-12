import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/transactions/hooks/transaction.hook", () => ({
  useTransactionsQuery: () => ({
    data: undefined,
    isLoading: false,
    isFetching: false,
  }),
  useTransactionYearsQuery: () => ({ data: [] }),
}));
vi.mock("@/features/transactions/containers/TransactionListContainer", () => ({
  TransactionListContainer: () => <div />,
}));
vi.mock("@/shared/components/customs/TransactionSummary", () => ({
  TransactionSummary: () => <div />,
}));
vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({ locale: "en-US", t: (key: string) => key }),
}));
vi.mock("../components/MonthYearNavigator", () => ({
  default: ({ onNextMonth }: { onNextMonth: () => void }) => (
    <button onClick={onNextMonth}>Next month</button>
  ),
}));
vi.mock("../components/JournalCalendarGrid", () => ({
  default: () => <div />,
}));

import JournalCalendarContainer from "./JournalCalendarContainer";

describe("JournalCalendarContainer", () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollTo = vi.fn();
  });

  it("returns the summary and transaction list to the top after next month", () => {
    render(<JournalCalendarContainer />);
    vi.mocked(HTMLElement.prototype.scrollTo).mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Next month" }));

    expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });
});
