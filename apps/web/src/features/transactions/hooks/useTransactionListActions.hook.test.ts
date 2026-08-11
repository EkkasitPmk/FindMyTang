import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const openTransactionSheet = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("./transaction-sheet.hook", () => ({
  useTransactionSheetStore: (
    selector: (state: { open: () => void }) => unknown,
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

  it("opens the desktop sheet while keeping the transaction list route", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );
    window.history.replaceState({}, "", "/journal?month=2026-08");
    const { result } = renderHook(() => useTransactionListActions(vi.fn()));

    act(() => result.current.handleTransactionItemClick(transaction));

    expect(push).toHaveBeenCalledWith(
      "/journal?month=2026-08&type=EXPENSE&id=tx-1&assetId=asset-1",
      { scroll: false },
    );
    expect(openTransactionSheet).toHaveBeenCalledOnce();
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
});
