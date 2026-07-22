import { describe, it, expect, vi } from "vitest";
import { processAssetTransactions } from "./asset.helper";
import {
  TransactionResponse,
  TransactionType,
} from "@/shared/lib/types/transaction.type";
import { formatDisplayDate } from "@/shared/lib/helpers/date.helper";

vi.mock("react-toastify", () => ({ toast: { error: vi.fn() } }));

describe("asset.helper", () => {
  describe("processAssetTransactions", () => {
    it("should return empty state when transactions is undefined or empty", () => {
      const result = processAssetTransactions({
        transactions: [],
        selectedYear: "2026",
        selectedMonth: "July",
      });

      expect(result.months).toEqual([]);
      expect(result.years).toEqual([]);
      expect(result.effectiveYear).toBe("Select");
      expect(result.effectiveMonth).toBe("Select");
      expect(result.groupedTransactions).toEqual([]);
      expect(result.filteredItems).toEqual([]);
    });

    it("should process and filter transactions correctly by year and month", () => {
      const mockTransactions: TransactionResponse[] = [
        {
          id: "1",
          type: "INCOME" as TransactionType,
          amount: 100,
          transactionDate: "2026-07-15T00:00:00.000Z",
          assetId: "a1",
          createdAt: "2026-07-15T00:00:00.000Z",
          updatedAt: "2026-07-15T00:00:00.000Z",
        },
        {
          id: "2",
          type: "EXPENSE" as TransactionType,
          amount: 50,
          transactionDate: "2026-06-10T00:00:00.000Z",
          assetId: "a1",
          createdAt: "2026-06-10T00:00:00.000Z",
          updatedAt: "2026-06-10T00:00:00.000Z",
        },
        {
          id: "3",
          type: "TRANSFER" as TransactionType,
          amount: 200,
          transactionDate: "2025-12-01T00:00:00.000Z",
          assetId: "a1",
          createdAt: "2025-12-01T00:00:00.000Z",
          updatedAt: "2025-12-01T00:00:00.000Z",
        },
      ];

      // 1. Should correctly extract all available years and select the specified year
      const result2026 = processAssetTransactions({
        transactions: mockTransactions,
        selectedYear: "2026",
        selectedMonth: "July",
      });

      expect(result2026.years).toEqual(["2026", "2025"]);
      expect(result2026.effectiveYear).toBe("2026");
      expect(result2026.months).toEqual(["July", "June"]); // Sorted descending
      expect(result2026.effectiveMonth).toBe("July");
      expect(result2026.filteredItems).toHaveLength(1);
      expect(result2026.filteredItems[0].id).toBe("1");
      expect(result2026.groupedTransactions).toHaveLength(1);
      expect(result2026.groupedTransactions[0].dateStr).toBe(
        formatDisplayDate(new Date("2026-07-15T00:00:00.000Z")),
      );

      // 2. Should fallback to the most recent year if selectedYear is not available
      const resultFallbackYear = processAssetTransactions({
        transactions: mockTransactions,
        selectedYear: "2030",
        selectedMonth: "Select",
      });

      expect(resultFallbackYear.effectiveYear).toBe("2026"); // Falls back to first (most recent) year
    });

    it("should group multiple transactions on the same day", () => {
      const mockTransactions: TransactionResponse[] = [
        {
          id: "1",
          type: "INCOME" as TransactionType,
          amount: 100,
          transactionDate: "2026-07-15T10:00:00.000Z",
          assetId: "a1",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "2",
          type: "EXPENSE" as TransactionType,
          amount: 50,
          transactionDate: "2026-07-15T15:00:00.000Z", // Same day
          assetId: "a1",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "3",
          type: "TRANSFER" as TransactionType,
          amount: 200,
          transactionDate: "2026-07-10T00:00:00.000Z", // Different day
          assetId: "a1",
          createdAt: "",
          updatedAt: "",
        },
      ];

      const result = processAssetTransactions({
        transactions: mockTransactions,
        selectedYear: "2026",
        selectedMonth: "July",
      });

      expect(result.groupedTransactions).toHaveLength(2);
      expect(result.groupedTransactions[0].items).toHaveLength(2);
      expect(result.groupedTransactions[1].items).toHaveLength(1);
    });
  });
});
