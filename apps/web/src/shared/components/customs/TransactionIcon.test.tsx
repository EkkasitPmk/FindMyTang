import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { TransactionIcon } from "./TransactionIcon";

describe("TransactionIcon", () => {
  it("renders TRANSFER icon with bg-transfer/15 and text-transfer styling", () => {
    const mockTransferTx = {
      id: "tx-1",
      type: "TRANSFER",
      amount: 500,
      transactionDate: "2026-10-12T00:00:00.000Z",
      createdAt: "2026-10-12T00:00:00.000Z",
      updatedAt: "2026-10-12T00:00:00.000Z",
    } as TransactionResponse;

    const { container } = render(<TransactionIcon transaction={mockTransferTx} />);
    const span = container.querySelector("span");

    expect(span).toHaveClass("bg-transfer/15");
    expect(span).toHaveClass("text-transfer");
    expect(container.querySelector("svg.lucide-arrow-right-left")).toBeInTheDocument();
  });

  it("renders ADJUSTMENT icon with bg-info/15 and text-info styling", () => {
    const mockAdjustmentTx = {
      id: "tx-2",
      type: "ADJUSTMENT",
      amount: 100,
      transactionDate: "2026-10-12T00:00:00.000Z",
      createdAt: "2026-10-12T00:00:00.000Z",
      updatedAt: "2026-10-12T00:00:00.000Z",
    } as TransactionResponse;

    const { container } = render(<TransactionIcon transaction={mockAdjustmentTx} />);
    const span = container.querySelector("span");

    expect(span).toHaveClass("bg-info/15");
    expect(span).toHaveClass("text-info");
    expect(container.querySelector("svg.lucide-sliders-horizontal")).toBeInTheDocument();
  });
});
