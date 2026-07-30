import { describe, expect, it } from "vitest";
import { calculateNetTotal } from "./transaction-list.helper";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";

const transaction = (type: TransactionResponse["type"], amount: number) =>
  ({ type, amount }) as TransactionResponse;

describe("calculateNetTotal", () => {
  it("does not include transfers in the sticky net total", () => {
    expect(
      calculateNetTotal([
        transaction("INCOME", 1000),
        transaction("TRANSFER", 500),
        transaction("EXPENSE", 200),
      ]),
    ).toBe(800);
  });
});
