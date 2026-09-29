import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const push = vi.fn();
const closeSheet = vi.fn();
const mockCreateTransactionMutate = vi.fn();
const mockUpdateTransactionMutate = vi.fn();
const mockHandleConfirmDate = vi.fn();
let mockHasUnconfirmedDateSelection = false;
let mockTempDate: Date | undefined = undefined;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("../hooks/transaction-sheet.hook", () => ({
  useTransactionSheetStore: (
    selector: (state: { close: () => void }) => unknown,
  ) => selector({ close: closeSheet }),
}));

vi.mock("../hooks/transaction.hook", () => ({
  useTransactionQuery: (_id?: string, options?: { initialData?: unknown }) => ({
    data: options?.initialData,
    isLoading: false,
  }),
}));

vi.mock("../components/TransactionTypeContent", () => ({
  default: ({ selection }: { selection: { onEditCategory: () => void } }) => (
    <button data-testid="edit-category-btn" onClick={selection.onEditCategory}>
      Edit Category
    </button>
  ),
}));

vi.mock("../components/TransactionHeader", () => ({ default: () => <div /> }));
vi.mock("../components/TransactionTypeTabs", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../components/TransactionModals", () => ({
  default: (props: {
    isUnconfirmedDateModalOpen: boolean;
    onConfirmUnconfirmedDate: () => void;
  }) => (
    <div data-testid="transaction-modals">
      {props.isUnconfirmedDateModalOpen && (
        <button
          data-testid="confirm-unconfirmed-date-btn"
          onClick={props.onConfirmUnconfirmedDate}
        >
          Confirm Date
        </button>
      )}
    </div>
  ),
}));

vi.mock("../components/TransactionFormActions", () => ({
  default: () => (
    <button type="submit" data-testid="save-tx-btn">
      Save
    </button>
  ),
}));

vi.mock("../hooks/useTransactionSelections.hook", () => ({
  useTransactionSelections: () => ({
    filteredCategories: [],
    safeAssets: [],
    isLoadingCategoryList: false,
    isLoadingAssetList: false,
  }),
}));

vi.mock("../hooks/useTransactionMutations.hook", () => ({
  useTransactionMutations: () => ({
    createTransaction: {
      mutate: mockCreateTransactionMutate,
      isPending: false,
    },
    updateTransaction: {
      mutate: mockUpdateTransactionMutate,
      isPending: false,
    },
    deleteTransaction: { mutate: vi.fn(), isPending: false },
  }),
}));

vi.mock("../hooks/useTransactionAmount.hook", () => ({
  useTransactionAmount: () => ({
    amountInputRef: { current: null },
    displayAmount: "0",
    numericAmount: 0,
    handleCurrencyInput: vi.fn(),
  }),
}));

vi.mock("../hooks/useTransactionDate.hook", () => ({
  useTransactionDate: () => ({
    isCalendarOpen: false,
    handleOpenCalendar: vi.fn(),
    handleSelectDate: vi.fn(),
    hasUnconfirmedDateSelection: mockHasUnconfirmedDateSelection,
    tempDate: mockTempDate,
    handleConfirmDate: mockHandleConfirmDate,
  }),
}));

vi.mock("../hooks/useTransactionAttachment.hook", () => ({
  useTransactionAttachment: () => ({
    imageUrls: [],
    fileErrors: [],
    isPendingUpload: false,
    handleFileSelect: vi.fn(),
    handleRemoveImage: vi.fn(),
  }),
}));

vi.mock("../hooks/transaction-form.hook", () => ({
  useTransactionInitialization: vi.fn(),
}));

vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({
    currentLanguage: "en",
    t: (key: string) => key,
  }),
}));

import TransactionsContainer from "./TransactionsContainer";

describe("TransactionsContainer - handleEditCategoryClick", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHasUnconfirmedDateSelection = false;
    mockTempDate = undefined;
  });

  it("closes the sheet and navigates to /settings?tab=categories when in desktop sheet", () => {
    render(<TransactionsContainer isDesktopSheet={true} />);

    fireEvent.click(screen.getByTestId("edit-category-btn"));

    expect(closeSheet).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/settings?tab=categories");
  });

  it("navigates to /categories without closing sheet on mobile", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );

    render(<TransactionsContainer isDesktopSheet={false} />);

    fireEvent.click(screen.getByTestId("edit-category-btn"));

    expect(closeSheet).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/categories");
  });

  it("closes the sheet and navigates to /settings?tab=categories on desktop even if isDesktopSheet prop is false", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: query === "(min-width: 1024px)",
      })),
    );

    render(<TransactionsContainer isDesktopSheet={false} />);

    fireEvent.click(screen.getByTestId("edit-category-btn"));

    expect(closeSheet).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/settings?tab=categories");
  });

  it("submits the changed time when unconfirmed date modal is confirmed", async () => {
    mockHasUnconfirmedDateSelection = true;
    mockTempDate = new Date("2026-08-12T15:30:00.000Z");

    const desktopTransaction = {
      id: "tx-1",
      type: "EXPENSE" as const,
      amount: 150,
      assetId: "asset-1",
      categoryId: "cat-1",
      transactionDate: "2026-08-12T10:00:00.000Z",
      note: "Lunch",
      createdAt: "2026-08-12T10:00:00.000Z",
      updatedAt: "2026-08-12T10:00:00.000Z",
      attachmentUrl: null,
    };

    render(
      <TransactionsContainer
        isDesktopSheet={false}
        desktopTransaction={desktopTransaction}
        initialTransaction={desktopTransaction}
      />,
    );

    fireEvent.click(screen.getByTestId("save-tx-btn"));

    const confirmModalBtn = await screen.findByTestId(
      "confirm-unconfirmed-date-btn",
    );
    fireEvent.click(confirmModalBtn);

    expect(mockUpdateTransactionMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "tx-1",
        data: expect.objectContaining({
          transactionDate: "2026-08-12T15:30:00.000Z",
        }),
      }),
    );
    expect(mockHandleConfirmDate).toHaveBeenCalled();
  });
});
