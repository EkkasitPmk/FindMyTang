import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const refresh = vi.fn();
let mutationOptions: { onSuccess: (message: string) => void } | undefined;

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("@/shared/lib/hooks/useTranslation.hook", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("@/shared/components/customs/TransactionList", () => ({
  TransactionList: () => <div />,
}));
vi.mock("@/shared/components/skeletons/TransactionListSkeleton", () => ({
  default: () => <div />,
}));
vi.mock("../components/TransactionListModals", () => ({
  default: () => <div />,
}));
vi.mock("../hooks/useInfiniteTransactionScroll.hook", () => ({
  useInfiniteTransactionScroll: () => null,
}));
vi.mock("../hooks/useTransactionListMutations.hook", () => ({
  useTransactionListMutations: (options: typeof mutationOptions) => {
    mutationOptions = options;
    return {
      restoreTransaction: { mutate: vi.fn(), isPending: false },
      deleteTransaction: { mutate: vi.fn(), isPending: false },
    };
  },
}));
vi.mock("../hooks/useTransactionListActions.hook", () => ({
  useTransactionListActions: () => ({
    isRestoreModalOpen: false,
    setIsRestoreModalOpen: vi.fn(),
    transactionToRestore: null,
    setTransactionToRestore: vi.fn(),
    transactionToDelete: null,
    setTransactionToDelete: vi.fn(),
    handleTransactionItemClick: vi.fn(),
    handleRestoreClick: vi.fn(),
    handleDeleteClick: vi.fn(),
  }),
}));
vi.mock("@/shared/lib/hooks/useConfirmModal.hook", () => ({
  useConfirmModal: () => ({
    isOpen: false,
    open: vi.fn(),
    close: vi.fn(),
    isHardDelete: false,
    setIsHardDelete: vi.fn(),
  }),
}));
vi.mock("@/shared/lib/hooks/useModalState.hook", () => ({
  useModalState: () => ({
    modalState: { isOpen: false, status: "loading" },
    setModalState: vi.fn(),
    resetModalState: vi.fn(),
  }),
}));

import { TransactionListContainer } from "./TransactionListContainer";

describe("TransactionListContainer", () => {
  beforeEach(() => {
    refresh.mockClear();
    mutationOptions = undefined;
  });

  it("refreshes server consumers after a list mutation succeeds", () => {
    render(
      <TransactionListContainer
        groupedTransactions={[]}
        isLoadingTransactions={false}
      />,
    );

    mutationOptions?.onSuccess("Transaction updated");

    expect(refresh).toHaveBeenCalledOnce();
  });
});
