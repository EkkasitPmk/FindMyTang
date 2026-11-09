import { describe, expect, it } from "vitest";
import {
  getAmountDisplayConfig,
  getTransferDetails,
  getDisplayTitle,
  getTimeDisplay,
  getTimeOnly,
} from "./transaction-item.helper";
import { TransactionResponse } from "../types/transaction.type";

describe("transaction-item.helper", () => {
  describe("getTransferDetails", () => {
    it("returns both false for non-transfer transaction", () => {
      const tx = {
        type: "EXPENSE",
        assetId: "a1",
      } as unknown as TransactionResponse;
      expect(getTransferDetails(tx, "a1")).toEqual({
        isTransferIn: false,
        isTransferOut: false,
      });
    });

    it("marks transfer in when currentAssetId equals toAssetId", () => {
      const tx = {
        type: "TRANSFER",
        assetId: "a1",
        toAssetId: "a2",
      } as unknown as TransactionResponse;
      expect(getTransferDetails(tx, "a2")).toEqual({
        isTransferIn: true,
        isTransferOut: false,
      });
    });

    it("marks transfer out when currentAssetId equals assetId", () => {
      const tx = {
        type: "TRANSFER",
        assetId: "a1",
        toAssetId: "a2",
      } as unknown as TransactionResponse;
      expect(getTransferDetails(tx, "a1")).toEqual({
        isTransferIn: false,
        isTransferOut: true,
      });
    });

    it("returns both false when currentAssetId matches neither asset", () => {
      const tx = {
        type: "TRANSFER",
        assetId: "a1",
        toAssetId: "a2",
      } as unknown as TransactionResponse;
      expect(getTransferDetails(tx, "a3")).toEqual({
        isTransferIn: false,
        isTransferOut: false,
      });
      expect(getTransferDetails(tx, undefined)).toEqual({
        isTransferIn: false,
        isTransferOut: false,
      });
    });
  });

  describe("getAmountDisplayConfig", () => {
    it("handles income transactions correctly", () => {
      expect(getAmountDisplayConfig("INCOME", false, false, 50)).toEqual({
        amountColorClass: "text-income",
        amountPrefix: "+",
        isIncome: true,
        isExpense: false,
      });
    });

    it("handles expense transactions correctly", () => {
      expect(getAmountDisplayConfig("EXPENSE", false, false, 50)).toEqual({
        amountColorClass: "text-expense",
        amountPrefix: "-",
        isIncome: false,
        isExpense: true,
      });
    });

    it("handles positive and negative adjustment transactions correctly", () => {
      expect(
        getAmountDisplayConfig("ADJUSTMENT", false, false, 10),
      ).toMatchObject({
        amountColorClass: "text-income",
        amountPrefix: "+",
      });
      expect(
        getAmountDisplayConfig("ADJUSTMENT", false, false, -10),
      ).toMatchObject({
        amountColorClass: "text-expense",
        amountPrefix: "-",
      });
      expect(getAmountDisplayConfig("ADJUSTMENT", false, false)).toMatchObject({
        amountColorClass: "text-income",
        amountPrefix: "+",
      });
    });

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
  });

  describe("getDisplayTitle", () => {
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

    it("returns localized or lowercase title for internal transfer and adjustment", () => {
      const transferTx = {
        type: "TRANSFER",
        toAssetId: "a2",
      } as unknown as TransactionResponse;
      expect(getDisplayTitle(transferTx)).toBe("transfer");
      expect(getDisplayTitle(transferTx, () => "โอนเงิน")).toBe("โอนเงิน");

      const adjTx = {
        type: "ADJUSTMENT",
      } as unknown as TransactionResponse;
      expect(getDisplayTitle(adjTx)).toBe("adjustment");
      expect(getDisplayTitle(adjTx, () => "ปรับปรุงยอด")).toBe("ปรับปรุงยอด");
    });

    it("falls back to category name, note, or type", () => {
      const withCategory = {
        type: "EXPENSE",
        category: { name: "Dining" },
        note: "Dinner",
      } as unknown as TransactionResponse;
      expect(getDisplayTitle(withCategory)).toBe("Dining");

      const withNoteOnly = {
        type: "EXPENSE",
        category: null,
        note: "Dinner",
      } as unknown as TransactionResponse;
      expect(getDisplayTitle(withNoteOnly)).toBe("Dinner");

      const withTypeOnly = {
        type: "EXPENSE",
        category: null,
        note: "",
      } as unknown as TransactionResponse;
      expect(getDisplayTitle(withTypeOnly)).toBe("EXPENSE");
    });
  });

  describe("getTimeDisplay and getTimeOnly", () => {
    it("formats date without time when transactionDate is midnight T00:00:00", () => {
      const display = getTimeDisplay("2026-07-08T00:00:00.000Z");
      expect(display).not.toMatch(/\d{2}:\d{2}$/);

      // date without literal 'T00:00:00' but midnight in local time
      const localMidnight = new Date(2026, 6, 8, 0, 0, 0)
        .toISOString()
        .replace("T00:00:00", " 00:00:00");
      expect(getTimeDisplay(localMidnight)).toBeDefined();
    });

    it("formats date with time when transaction has specific time", () => {
      const display = getTimeDisplay("2026-07-08T14:30:00.000Z");
      expect(display).toMatch(/\d{2}:\d{2}$/);
    });

    it("returns null for getTimeOnly when transactionDate has no time", () => {
      expect(getTimeOnly("2026-07-08T00:00:00.000Z")).toBeNull();

      const localMidnight = new Date(2026, 6, 8, 0, 0, 0)
        .toISOString()
        .replace("T00:00:00", " 00:00:00");
      expect(getTimeOnly(localMidnight)).toBeNull();
    });

    it("returns HH:mm string for getTimeOnly when transactionDate has time", () => {
      const time = getTimeOnly("2026-07-08T14:30:00.000Z");
      expect(time).toMatch(/\d{2}:\d{2}/);
    });
  });
});
