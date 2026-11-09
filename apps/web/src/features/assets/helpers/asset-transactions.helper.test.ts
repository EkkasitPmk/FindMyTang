import { describe, expect, it } from "vitest";
import {
  applyTypeFilter,
  getAvailableYears,
  groupTransactionsByDate,
  handleDateMode,
  handleSearchMode,
} from "./asset-transactions.helper";
import {
  TransactionResponse,
  TransactionType,
} from "@/shared/lib/types/transaction.type";

describe("asset-transactions.helper", () => {
  const baseTx: TransactionResponse = {
    id: "tx-1",
    type: "INCOME" as TransactionType,
    amount: 1000,
    transactionDate: "2026-05-15T10:00:00.000Z",
    assetId: "asset-1",
    createdAt: "2026-05-15T10:00:00.000Z",
    updatedAt: "2026-05-15T10:00:00.000Z",
  };

  describe("getAvailableYears", () => {
    it("extracts unique years sorted descending", () => {
      const txs = [
        { ...baseTx, transactionDate: "2024-01-01T00:00:00.000Z" },
        { ...baseTx, transactionDate: "2026-06-01T00:00:00.000Z" },
        { ...baseTx, transactionDate: "2025-03-01T00:00:00.000Z" },
        { ...baseTx, transactionDate: "2026-12-01T00:00:00.000Z" },
      ];

      expect(getAvailableYears(txs)).toEqual(["2026", "2025", "2024"]);
    });

    it("returns empty array when transactions is empty", () => {
      expect(getAvailableYears([])).toEqual([]);
    });
  });

  describe("applyTypeFilter", () => {
    it("returns all transactions when filterType is ALL", () => {
      const txs = [
        { ...baseTx, id: "1", type: "INCOME" as TransactionType },
        { ...baseTx, id: "2", type: "EXPENSE" as TransactionType },
      ];

      expect(applyTypeFilter(txs, "ALL")).toEqual(txs);
    });

    it("filters transactions by specific type", () => {
      const txs = [
        { ...baseTx, id: "1", type: "INCOME" as TransactionType },
        { ...baseTx, id: "2", type: "EXPENSE" as TransactionType },
        { ...baseTx, id: "3", type: "TRANSFER" as TransactionType },
      ];

      expect(applyTypeFilter(txs, "EXPENSE")).toEqual([
        { ...baseTx, id: "2", type: "EXPENSE" as TransactionType },
      ]);
    });
  });

  describe("handleSearchMode", () => {
    const searchTxs: TransactionResponse[] = [
      {
        ...baseTx,
        id: "tx-note",
        note: "Grocery shopping",
        amount: 250,
        type: "EXPENSE" as TransactionType,
        transactionDate: "2026-03-10T00:00:00.000Z",
      },
      {
        ...baseTx,
        id: "tx-cat",
        category: {
          id: "cat-1",
          name: "Dining",
          type: "EXPENSE",
          color: "#f00",
          icon: "utensils",
        },
        amount: 500,
        type: "EXPENSE" as TransactionType,
        transactionDate: "2026-04-10T00:00:00.000Z",
      },
      {
        ...baseTx,
        id: "tx-amount",
        amount: 9999,
        type: "INCOME" as TransactionType,
        transactionDate: "2025-05-10T00:00:00.000Z",
      },
      {
        ...baseTx,
        id: "tx-toasset",
        amount: 1500,
        type: "TRANSFER" as TransactionType,
        toAsset: {
          id: "a-2",
          name: "Savings Vault",
          type: "BANK",
          balance: 5000,
        },
        transactionDate: "2026-01-10T00:00:00.000Z",
      },
    ];

    it("searches with 'All time' default when selectedYear is invalid", () => {
      const result = handleSearchMode(
        searchTxs,
        ["2026", "2025"],
        "InvalidYear",
      );

      expect(result.effectiveYear).toBe("All time");
      expect(result.years).toEqual(["All time", "2026", "2025"]);
      expect(result.items).toHaveLength(4);
      expect(result.availableMonths).toEqual([]);
      expect(result.effectiveMonth).toBe("Select");
    });

    it("filters by effectiveYear when a valid year is selected", () => {
      const result = handleSearchMode(searchTxs, ["2026", "2025"], "2025");

      expect(result.effectiveYear).toBe("2025");
      expect(result.items).toEqual([
        expect.objectContaining({ id: "tx-amount" }),
      ]);
    });

    it("matches keyword against note", () => {
      const result = handleSearchMode(
        searchTxs,
        ["2026", "2025"],
        "All time",
        "grocery",
      );
      expect(result.items.map((i) => i.id)).toEqual(["tx-note"]);
    });

    it("matches keyword against category name", () => {
      const result = handleSearchMode(
        searchTxs,
        ["2026", "2025"],
        "All time",
        "dining",
      );
      expect(result.items.map((i) => i.id)).toEqual(["tx-cat"]);
    });

    it("matches keyword against amount", () => {
      const result = handleSearchMode(
        searchTxs,
        ["2026", "2025"],
        "All time",
        "9999",
      );
      expect(result.items.map((i) => i.id)).toEqual(["tx-amount"]);
    });

    it("matches keyword against type", () => {
      const result = handleSearchMode(
        searchTxs,
        ["2026", "2025"],
        "All time",
        "transfer",
      );
      expect(result.items.map((i) => i.id)).toEqual(["tx-toasset"]);
    });

    it("matches keyword against toAsset name", () => {
      const result = handleSearchMode(
        searchTxs,
        ["2026", "2025"],
        "All time",
        "savings vault",
      );
      expect(result.items.map((i) => i.id)).toEqual(["tx-toasset"]);
    });

    it("returns items unchanged if searchKeyword is undefined or empty", () => {
      const result = handleSearchMode(searchTxs, ["2026", "2025"], "All time");
      expect(result.items).toHaveLength(4);
    });
  });

  describe("handleDateMode", () => {
    const dateTxs: TransactionResponse[] = [
      {
        ...baseTx,
        id: "tx-1",
        transactionDate: "2026-03-15T00:00:00.000Z",
      },
      {
        ...baseTx,
        id: "tx-2",
        transactionDate: "2026-05-20T00:00:00.000Z",
      },
      {
        ...baseTx,
        id: "tx-3",
        transactionDate: "2025-03-10T00:00:00.000Z",
      },
    ];

    it("filters by selected year and selected month when both are valid", () => {
      const result = handleDateMode(dateTxs, ["2026", "2025"], "2026", "March");

      expect(result.effectiveYear).toBe("2026");
      expect(result.effectiveMonth).toBe("March");
      expect(result.items.map((i) => i.id)).toEqual(["tx-1"]);
      expect(result.availableMonths).toEqual(["May", "March"]);
    });

    it("falls back to first available year and first available month", () => {
      const result = handleDateMode(
        dateTxs,
        ["2026", "2025"],
        "Unknown",
        "Unknown",
      );

      expect(result.effectiveYear).toBe("2026");
      expect(result.effectiveMonth).toBe("May");
      expect(result.items.map((i) => i.id)).toEqual(["tx-2"]);
    });

    it("falls back to 'Select' when availableYears is empty", () => {
      const result = handleDateMode([], [], "2026", "March");

      expect(result.effectiveYear).toBe("Select");
      expect(result.effectiveMonth).toBe("Select");
      expect(result.items).toEqual([]);
      expect(result.availableMonths).toEqual([]);
    });

    it("falls back to 'Select' for effectiveMonth when availableMonths is empty", () => {
      const result = handleDateMode([], ["2026"], "2026", "March");

      expect(result.effectiveYear).toBe("2026");
      expect(result.effectiveMonth).toBe("Select");
      expect(result.items).toEqual([]);
    });
  });

  describe("groupTransactionsByDate", () => {
    it("groups transactions by formatted date string", () => {
      const txs: TransactionResponse[] = [
        {
          ...baseTx,
          id: "tx-1",
          transactionDate: "2026-05-15T10:00:00.000Z",
        },
        {
          ...baseTx,
          id: "tx-2",
          transactionDate: "2026-05-15T14:00:00.000Z",
        },
        {
          ...baseTx,
          id: "tx-3",
          transactionDate: "2026-05-16T09:00:00.000Z",
        },
      ];

      const grouped = groupTransactionsByDate(txs);

      expect(grouped).toHaveLength(2);
      expect(grouped[0].items).toHaveLength(2);
      expect(grouped[1].items).toHaveLength(1);
    });

    it("returns empty array for empty transactions", () => {
      expect(groupTransactionsByDate([])).toEqual([]);
    });
  });
});
