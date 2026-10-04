import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AssetDetail from "./AssetDetail";
import { Asset, AssetType } from "@/shared/lib/types/asset.type";

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    locale: "en-US",
    t: (key: string) => {
      const dict: Record<string, string> = {
        balance: "Balance",
        recentTransactions: "Recent Transactions",
        showDeletedItems: "Show deleted items",
        income: "Income",
        expense: "Expense",
        transfer: "Transfer",
        adjustment: "Adjustment",
        netCashFlow: "Net Cash Flow",
        items: "items",
        noFilter: "No filter",
      };
      return dict[key] || key;
    },
  }),
}));

vi.mock("@/features/transactions/containers/TransactionListContainer", () => ({
  TransactionListContainer: () => (
    <div data-testid="transaction-list-container" />
  ),
}));

const mockAsset: Asset = {
  id: "asset-1",
  name: "Bank Account",
  type: AssetType.BANK,
  balance: 6.16,
  color: "#2563EB",
  isArchived: false,
  deletedAt: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("AssetDetail", () => {
  beforeEach(() => {
    class MockObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    global.IntersectionObserver =
      MockObserver as unknown as typeof IntersectionObserver;
    global.ResizeObserver = MockObserver as unknown as typeof ResizeObserver;
  });

  const defaultProps = {
    asset: mockAsset,
    groupedTransactions: [],
    summary: {
      income: 420.8,
      expense: 414.64,
      transfer: 70,
      adjustment: 0,
      net: 6.16,
      incomeCount: 3,
      expenseCount: 4,
      transferCount: 1,
      adjustmentCount: 0,
    },
    isLoading: false,
    isLoadingTransactions: false,
    isAddMenuOpen: false,
    onAddMenuToggle: vi.fn(),
    onAddMenuClose: vi.fn(),
    onTransferClick: vi.fn(),
    onAdjustmentClick: vi.fn(),
    onAddTransactionClick: vi.fn(),
    onAddExpenseClick: vi.fn(),
    onAddIncomeClick: vi.fn(),
    selected: "August",
    months: ["August", "July"],
    handleSelect: vi.fn(),
    years: ["2026"],
    selectedYear: "2026",
    handleSelectYear: vi.fn(),
    isMonthOpen: false,
    setIsMonthOpen: vi.fn(),
    isYearOpen: false,
    setIsYearOpen: vi.fn(),
    viewOption: "recentTransactions",
    isViewOptionOpen: false,
    viewOptionRef: { current: null },
    onViewOptionToggle: vi.fn(),
    onViewOptionSelect: vi.fn(),
    translateDropdownItem: (item: string) => item,
  };

  it("renders balance, month/year selectors, flow cards and net cash flow", () => {
    render(<AssetDetail {...defaultProps} />);

    // Balance badge & amount
    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("6.16")).toBeInTheDocument();

    // Month & Year dropdown triggers
    expect(screen.getByText("August")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();

    // Flow cards with amounts and counts
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("+฿ 420.80")).toBeInTheDocument();
    expect(screen.getByText("3 items")).toBeInTheDocument();

    expect(screen.getByText("Expense")).toBeInTheDocument();
    expect(screen.getByText("-฿ 414.64")).toBeInTheDocument();
    expect(screen.getByText("4 items")).toBeInTheDocument();

    expect(screen.getByText("Transfer")).toBeInTheDocument();
    expect(screen.getByText("฿ 70.00")).toBeInTheDocument();
    expect(screen.getByText("1 items")).toBeInTheDocument();

    // Net Cash Flow row
    expect(screen.getByText("Net Cash Flow")).toBeInTheDocument();
    expect(screen.getByText("+฿ 6.16")).toBeInTheDocument();

    // Inline view option dropdown button & total count
    expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
    expect(screen.getByText("8 items")).toBeInTheDocument();

    // Add transaction primary button
    expect(screen.getByText("addTransaction")).toBeInTheDocument();
  });

  it("hides Balance Card and inline view option in search mode", () => {
    render(
      <AssetDetail {...defaultProps} isSearchMode searchKeyword="Lunch" />,
    );

    expect(screen.queryByText("Balance")).not.toBeInTheDocument();
    expect(screen.queryByText("6.16")).not.toBeInTheDocument();
    expect(screen.queryByText("+฿ 420.80")).not.toBeInTheDocument();
    expect(screen.queryByText("Recent Transactions")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("transaction-list-container"),
    ).toBeInTheDocument();
  });

  it("triggers onFilterSelect when clicking a flow card", () => {
    const onFilterSelect = vi.fn();
    render(<AssetDetail {...defaultProps} onFilterSelect={onFilterSelect} />);

    const expenseCard = screen.getByText("Expense").closest('[role="button"]');
    expect(expenseCard).toBeInTheDocument();
    fireEvent.click(expenseCard!);

    expect(onFilterSelect).toHaveBeenCalledWith("EXPENSE");
  });

  it("toggles filter to ALL when clicking the currently active flow card", () => {
    const onFilterSelect = vi.fn();
    render(
      <AssetDetail
        {...defaultProps}
        filterType="EXPENSE"
        onFilterSelect={onFilterSelect}
      />,
    );

    const activeCard = screen.getByRole("button", { pressed: true });
    expect(activeCard).toBeInTheDocument();
    expect(activeCard).toHaveTextContent("Expense");
    fireEvent.click(activeCard);

    expect(onFilterSelect).toHaveBeenCalledWith("ALL");
  });

  it("displays active filter chip and filtered count when filterType is active", () => {
    const onFilterSelect = vi.fn();
    render(
      <AssetDetail
        {...defaultProps}
        filterType="EXPENSE"
        onFilterSelect={onFilterSelect}
      />,
    );

    // Shows 4 items in both the expense card and the recent transactions header
    const itemCounts = screen.getAllByText("4 items");
    expect(itemCounts).toHaveLength(2);

    // Has clear filter chip
    const filterChip = screen.getByTitle("No filter");
    expect(filterChip).toBeInTheDocument();
    expect(filterChip).toHaveTextContent("Expense");

    fireEvent.click(filterChip);
    expect(onFilterSelect).toHaveBeenCalledWith("ALL");
  });
});
