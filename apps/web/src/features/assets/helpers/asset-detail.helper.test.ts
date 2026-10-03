import { describe, expect, it } from "vitest";
import {
  calculateAssetMonthlySummary,
  getAvailableMonths,
  getEffectiveMonth,
  getEffectiveYear,
  getTransactionDateRange,
  shouldFetchTransactions,
  shouldShowAssetLoading,
  shouldShowTransactionsLoading,
} from "./asset-detail.helper";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";

describe("asset-detail.helper", () => {
  describe("getEffectiveYear", () => {
    it("returns selected year if available in search mode", () => {
      expect(getEffectiveYear("2026", ["2026", "2025"], true, "2026")).toBe(
        "2026",
      );
    });

    it("defaults to All time in search mode if not available", () => {
      expect(getEffectiveYear("Select", ["2026"], true, "2026")).toBe(
        "All time",
      );
    });

    it("returns current year when availableYears is empty", () => {
      expect(getEffectiveYear("Select", [], false, "2026")).toBe("2026");
    });

    it("returns selectedYear when it is in availableYears", () => {
      expect(getEffectiveYear("2025", ["2026", "2025"], false, "2026")).toBe(
        "2025",
      );
    });
  });

  describe("getAvailableMonths", () => {
    it("returns empty array in search mode or when year is All time", () => {
      expect(
        getAvailableMonths(true, "2026", { "2026": ["January"] }, 1, "March"),
      ).toEqual([]);
      expect(
        getAvailableMonths(
          false,
          "All time",
          { "2026": ["January"] },
          1,
          "March",
        ),
      ).toEqual([]);
    });

    it("returns sorted months for year", () => {
      expect(
        getAvailableMonths(
          false,
          "2026",
          { "2026": ["January", "March", "February"] },
          1,
          "March",
        ),
      ).toEqual(["March", "February", "January"]);
    });

    it("returns fallback current month if no months and no years exist", () => {
      expect(getAvailableMonths(false, "2026", {}, 0, "March")).toEqual([
        "March",
      ]);
    });
  });

  describe("getEffectiveMonth", () => {
    it("returns Select in search mode", () => {
      expect(getEffectiveMonth("January", ["January"], true, "March")).toBe(
        "Select",
      );
    });

    it("returns fallback current month when availableMonths is empty", () => {
      expect(getEffectiveMonth("Select", [], false, "March")).toBe("March");
    });

    it("returns selectedMonth if present in availableMonths", () => {
      expect(
        getEffectiveMonth("January", ["February", "January"], false, "March"),
      ).toBe("January");
    });
  });

  describe("shouldShowTransactionsLoading", () => {
    it("returns true when available dates pending in normal mode", () => {
      expect(
        shouldShowTransactionsLoading(false, true, false, false, false),
      ).toBe(true);
    });

    it("returns true when transactions are fetching and pending", () => {
      expect(
        shouldShowTransactionsLoading(false, false, true, false, true),
      ).toBe(true);
    });

    it("returns false when fetching next page", () => {
      expect(
        shouldShowTransactionsLoading(false, false, true, true, false),
      ).toBe(false);
    });
  });

  describe("calculateAssetMonthlySummary", () => {
    it("correctly calculates sums and counts for all types", () => {
      const mockItems = [
        { id: "1", type: "INCOME", amount: 100 },
        { id: "2", type: "INCOME", amount: 50 },
        { id: "3", type: "EXPENSE", amount: 40 },
        { id: "4", type: "TRANSFER", amount: 30 },
        { id: "5", type: "ADJUSTMENT", amount: 10 },
      ] as TransactionResponse[];

      const summary = calculateAssetMonthlySummary(mockItems);

      expect(summary).toEqual({
        income: 150,
        expense: 40,
        transfer: 30,
        adjustment: 10,
        net: 110,
        incomeCount: 2,
        expenseCount: 1,
        transferCount: 1,
        adjustmentCount: 1,
      });
    });

    it("returns zeroes when items array is empty", () => {
      const summary = calculateAssetMonthlySummary([]);
      expect(summary).toEqual({
        income: 0,
        expense: 0,
        transfer: 0,
        adjustment: 0,
        net: 0,
        incomeCount: 0,
        expenseCount: 0,
        transferCount: 0,
        adjustmentCount: 0,
      });
    });
  });

  describe("getTransactionDateRange", () => {
    it("returns undefined from/to in search mode with All time", () => {
      expect(getTransactionDateRange(true, "All time", "Select")).toEqual({
        from: undefined,
        to: undefined,
      });
    });

    it("returns year range in search mode with specific year", () => {
      const range = getTransactionDateRange(true, "2026", "Select");
      expect(new Date(range.from!).getTime()).toBe(
        new Date(2026, 0, 1).getTime(),
      );
      expect(new Date(range.to!).getTime()).toBe(
        new Date(2026, 11, 31, 23, 59, 59).getTime(),
      );
    });

    it("returns undefined from/to when effectiveYear is Select", () => {
      expect(getTransactionDateRange(false, "Select", "January")).toEqual({
        from: undefined,
        to: undefined,
      });
    });

    it("returns full year range when effectiveMonth is Select", () => {
      const range = getTransactionDateRange(false, "2026", "Select");
      expect(new Date(range.from!).getTime()).toBe(
        new Date(2026, 0, 1).getTime(),
      );
      expect(new Date(range.to!).getTime()).toBe(
        new Date(2026, 11, 31, 23, 59, 59).getTime(),
      );
    });

    it("returns single month range for specific month", () => {
      const range = getTransactionDateRange(false, "2026", "January");
      expect(new Date(range.from!).getTime()).toBe(
        new Date(2026, 0, 1).getTime(),
      );
      expect(new Date(range.to!).getTime()).toBe(
        new Date(2026, 0, 31, 23, 59, 59).getTime(),
      );
    });
  });

  describe("shouldShowAssetLoading", () => {
    it("returns false if assets query is not pending", () => {
      expect(shouldShowAssetLoading(false, true, false, false, false)).toBe(
        false,
      );
    });

    it("returns true if assets pending and is guest", () => {
      expect(shouldShowAssetLoading(true, true, true, false, false)).toBe(true);
    });

    it("returns true if assets pending and no initial assets", () => {
      expect(shouldShowAssetLoading(true, false, false, false, false)).toBe(
        true,
      );
    });

    it("returns false if assets pending but has initial assets matching includeDeleted", () => {
      expect(shouldShowAssetLoading(true, false, true, false, false)).toBe(
        false,
      );
    });
  });

  describe("shouldFetchTransactions", () => {
    it("returns true in normal mode if hasAvailableDates is true", () => {
      expect(shouldFetchTransactions(false, "", true)).toBe(true);
    });

    it("returns false in search mode if keyword is empty", () => {
      expect(shouldFetchTransactions(true, "", true)).toBe(false);
    });

    it("returns true in search mode if keyword is provided and hasAvailableDates is true", () => {
      expect(shouldFetchTransactions(true, "coffee", true)).toBe(true);
    });

    it("returns false if hasAvailableDates is false", () => {
      expect(shouldFetchTransactions(false, "", false)).toBe(false);
    });
  });
});
