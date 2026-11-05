import { describe, expect, it } from "vitest";
import {
  getAmountDisplayConfig,
  getTransferDetails,
  getDisplayTitle,
} from "./transaction-item.helper";
import { TransactionResponse } from "../types/transaction.type";

describe("getAmountDisplayConfig", () => {
  it("keeps transfers neutral when no asset context is provided", () => {
    expect(getAmountDisplayConfig("TRANSFER", false, false, 100)).toEqual({
      amountColorClass: "text-primary-text",
      amountPrefix: "",
      isIncome: false,
      isExpense: false,
    });
  });

  it("shows transfer direction when an asset context is provided", () => {
    expect(
      getAmountDisplayConfig("TRANSFER", true, false, 100).amountPrefix,
    ).toBe("+");
    expect(
      getAmountDisplayConfig("TRANSFER", false, true, 100).amountPrefix,
    ).toBe("-");
  });

  it("marks external transfer as transfer out and shows minus amount", () => {
    const externalTx = {
      type: "TRANSFER",
      amount: 250,
      assetId: "asset-1",
      toAssetId: null,
    } as unknown as TransactionResponse;

    const { isTransferIn, isTransferOut } = getTransferDetails(externalTx);
    expect(isTransferIn).toBe(false);
    expect(isTransferOut).toBe(true);

    const config = getAmountDisplayConfig(
      "TRANSFER",
      isTransferIn,
      isTransferOut,
      250,
    );
    expect(config.amountPrefix).toBe("-");
    expect(config.amountColorClass).toBe("text-expense");
  });

  it("returns transferOut title for external transfer", () => {
    const externalTx = {
      type: "TRANSFER",
      amount: 250,
      assetId: "asset-1",
      toAssetId: null,
    } as unknown as TransactionResponse;

    expect(getDisplayTitle(externalTx)).toBe("transfer out");
    expect(
      getDisplayTitle(externalTx, (key) =>
        key === "transferOut" ? "โอนเงินออก" : key,
      ),
    ).toBe("โอนเงินออก");
  });
});
