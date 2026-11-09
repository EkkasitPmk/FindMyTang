import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const openTransactionSheet = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("./transaction-sheet.hook", () => ({
  useTransactionSheetStore: (
    selector: (state: { open: (transaction: unknown) => void }) => unknown,
  ) => selector({ open: openTransactionSheet }),
}));

import { useTransactionListActions } from "./useTransactionListActions.hook";

const transaction = {
  id: "tx-1",
  type: "EXPENSE",
  assetId: "asset-1",
} as Parameters<
  ReturnType<typeof useTransactionListActions>["handleTransactionItemClick"]
>[0];

describe("useTransactionListActions", () => {
  beforeEach(() => {
    push.mockClear();
    openTransactionSheet.mockClear();
  });

  it("opens the desktop sheet without navigating away from the list", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );
    window.history.replaceState({}, "", "/journal?month=2026-08");
    const { result } = renderHook(() => useTransactionListActions(vi.fn()));

    act(() => result.current.handleTransactionItemClick(transaction));

    expect(push).not.toHaveBeenCalled();
    expect(openTransactionSheet).toHaveBeenCalledWith(transaction);
  });

  it("navigates to the transaction page on mobile", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    const { result } = renderHook(() => useTransactionListActions(vi.fn()));

    act(() => result.current.handleTransactionItemClick(transaction));

    expect(push).toHaveBeenCalledWith(
      "/transaction?type=EXPENSE&id=tx-1&assetId=asset-1",
    );
    expect(openTransactionSheet).not.toHaveBeenCalled();
  });

  it("navigates to mobile transaction page with isDeleted and without assetId", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    const { result } = renderHook(() => useTransactionListActions(vi.fn()));

    const deletedTx = {
      id: "tx-2",
      type: "INCOME",
      deletedAt: "2026-08-12T00:00:00.000Z",
    } as Parameters<
      ReturnType<typeof useTransactionListActions>["handleTransactionItemClick"]
    >[0];

    act(() => result.current.handleTransactionItemClick(deletedTx));

    expect(push).toHaveBeenCalledWith(
      "/transaction?type=INCOME&id=tx-2&isDeleted=true",
    );
  });

  it("handles restore click and modal state setters", () => {
    const { result } = renderHook(() => useTransactionListActions(vi.fn()));

    act(() => {
      result.current.handleRestoreClick(transaction);
    });

    expect(result.current.isRestoreModalOpen).toBe(true);
    expect(result.current.transactionToRestore).toEqual(transaction);

    act(() => {
      result.current.setIsRestoreModalOpen(false);
      result.current.setTransactionToRestore(null);
    });

    expect(result.current.isRestoreModalOpen).toBe(false);
    expect(result.current.transactionToRestore).toBeNull();
  });

  it("handles delete click and delete state setter", () => {
    const openDeleteModal = vi.fn();
    const { result } = renderHook(() =>
      useTransactionListActions(openDeleteModal),
    );

    act(() => {
      result.current.handleDeleteClick(transaction);
    });

    expect(result.current.transactionToDelete).toEqual(transaction);
    expect(openDeleteModal).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setTransactionToDelete(null);
    });

    expect(result.current.transactionToDelete).toBeNull();
  });
});
