import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const { closeSheet } = vi.hoisted(() => ({
  closeSheet: vi.fn(),
}));

vi.mock("../hooks/transaction-sheet.hook", () => ({
  useTransactionSheetStore: (
    selector: (state: {
      isOpen: boolean;
      transaction: null;
      close: () => void;
    }) => unknown,
  ) => selector({ isOpen: true, transaction: null, close: closeSheet }),
}));
vi.mock("../containers/TransactionsContainer", () => ({
  default: () => <div />,
}));
vi.mock("@/shared/components/animate-ui/components/radix/sheet", () => ({
  Sheet: ({
    children,
    onOpenChange,
  }: {
    children: ReactNode;
    onOpenChange?: (open: boolean) => void;
  }) => <button onClick={() => onOpenChange?.(false)}>{children}</button>,
  SheetContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SheetDescription: () => <div />,
  SheetHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetTitle: () => <div />,
}));

import TransactionSheet from "./TransactionSheet";

describe("TransactionSheet", () => {
  beforeEach(() => {
    closeSheet.mockClear();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });

  it("clears its edit state when closed", () => {
    render(<TransactionSheet />);

    fireEvent.click(screen.getByRole("button"));

    expect(closeSheet).toHaveBeenCalledOnce();
  });
});
