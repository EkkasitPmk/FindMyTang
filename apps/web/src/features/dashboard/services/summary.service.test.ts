import { describe, expect, it, vi, beforeEach } from "vitest";
import http from "@/shared/lib/api/http";
import { getTodaySummaryApi, getThisMonthSummaryApi } from "./summary.service";
import {
  TransactionType,
  type LocalAsset,
  type LocalTransaction,
} from "@/shared/lib/storages/dexie.storage";
import { AssetType } from "@/shared/lib/types/asset.type";

let isGuestMode = true;
let mockAssets: LocalAsset[] = [];
let mockTransactions: LocalTransaction[] = [];

vi.mock("@/shared/lib/api/http", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("@/shared/lib/storages/guest.storage", () => ({
  useGuestStore: {
    getState: () => ({ isGuest: isGuestMode }),
  },
}));

vi.mock("@/shared/lib/storages/dexie.storage", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/shared/lib/storages/dexie.storage")
    >();
  return {
    ...actual,
    db: {
      assets: {
        filter: (predicate: (a: LocalAsset) => boolean) => ({
          toArray: vi.fn(async () => mockAssets.filter(predicate)),
        }),
      },
      transactions: {
        where: () => ({
          between: () => ({
            filter: (predicate: (t: LocalTransaction) => boolean) => ({
              toArray: vi.fn(async () => mockTransactions.filter(predicate)),
            }),
          }),
        }),
      },
    },
  };
});

describe("summary.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isGuestMode = true;
    mockTransactions = [];
    mockAssets = [
      {
        id: "asset-1",
        name: "Main Bank",
        type: AssetType.BANK,
        balance: 50000,
        displayOrder: 1,
        isArchived: false,
        includeInSnapshot: true,
        savingsAmount: 20000,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      {
        id: "asset-2",
        name: "Shortfall Account",
        type: AssetType.CASH,
        balance: 10000,
        displayOrder: 2,
        isArchived: false,
        includeInSnapshot: true,
        savingsAmount: 25000, // exceeds balance, clamped to 10000
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      {
        id: "asset-3",
        name: "Fully Excluded Account",
        type: AssetType.INVESTMENT,
        balance: 40000,
        displayOrder: 3,
        isArchived: false,
        includeInSnapshot: false,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      {
        id: "asset-4",
        name: "Archived Account",
        type: AssetType.BANK,
        balance: 10000,
        displayOrder: 4,
        isArchived: true,
        includeInSnapshot: true,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      {
        id: "asset-5",
        name: "Deleted Account",
        type: AssetType.CASH,
        balance: 5000,
        displayOrder: 5,
        isArchived: false,
        deletedAt: "2026-01-02",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      {
        id: "asset-6",
        name: "Zero Savings Account",
        type: AssetType.CASH,
        balance: 5000,
        displayOrder: 6,
        isArchived: false,
        includeInSnapshot: true,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ];
  });

  describe("Guest Mode", () => {
    it("calculates totals, net, and net worth with various transaction types for today", async () => {
      mockTransactions = [
        {
          id: "t-1",
          amount: 5000,
          type: TransactionType.INCOME,
          assetId: "asset-1",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-2",
          amount: 1500,
          type: TransactionType.EXPENSE,
          assetId: "asset-1",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-3",
          amount: 1000,
          type: TransactionType.TRANSFER,
          assetId: "asset-1",
          toAssetId: "asset-2", // internal transfer
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-4",
          amount: 500,
          type: TransactionType.TRANSFER,
          assetId: "asset-1", // external transfer (no toAssetId)
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-5",
          amount: 200,
          type: TransactionType.ADJUSTMENT,
          assetId: "asset-1",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-6",
          amount: 9999,
          type: TransactionType.EXPENSE,
          assetId: "asset-1",
          deletedAt: "2026-01-01", // should be filtered out
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      ];

      const summary = await getTodaySummaryApi();

      expect(summary.income).toBe(5000);
      expect(summary.expense).toBe(1500);
      expect(summary.transfer).toBe(1500); // 1000 + 500
      expect(summary.adjustment).toBe(200);
      // net = income (5000) - expense (1500) - externalTransfer (500) = 3000
      expect(summary.net).toBe(3000);

      // Spendable: Asset 1 (30,000) + Asset 2 (0) + Asset 3 (0) + Asset 6 (5,000) = 35,000
      expect(summary.totalNetWorth).toBe(35000);
      // Excluded: Asset 1 (20,000) + Asset 2 (10,000) + Asset 3 (40,000) = 70,000
      expect(summary.excludedNetWorth).toBe(70000);
    });

    it("calculates totals, net, and net worth with various transaction types for this month", async () => {
      mockTransactions = [
        {
          id: "t-1",
          amount: 10000,
          type: TransactionType.INCOME,
          assetId: "asset-1",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-2",
          amount: 2000,
          type: TransactionType.EXPENSE,
          assetId: "asset-1",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-3",
          amount: 3000,
          type: TransactionType.TRANSFER,
          assetId: "asset-1",
          toAssetId: "asset-2",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-4",
          amount: 1000,
          type: TransactionType.TRANSFER,
          assetId: "asset-1",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-5",
          amount: 150,
          type: TransactionType.ADJUSTMENT,
          assetId: "asset-1",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "t-6",
          amount: 8888,
          type: TransactionType.INCOME,
          assetId: "asset-1",
          deletedAt: "2026-01-01",
          date: new Date().toISOString(),
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      ];

      const summary = await getThisMonthSummaryApi();

      expect(summary.income).toBe(10000);
      expect(summary.expense).toBe(2000);
      expect(summary.transfer).toBe(4000);
      expect(summary.adjustment).toBe(150);
      // net = 10000 - 2000 - 1000 = 7000
      expect(summary.net).toBe(7000);
      expect(summary.totalNetWorth).toBe(35000);
      expect(summary.excludedNetWorth).toBe(70000);
    });
  });

  describe("Non-Guest (HTTP) Mode", () => {
    beforeEach(() => {
      isGuestMode = false;
    });

    it("fetches today summary via http.get", async () => {
      const mockResponse = {
        income: 1000,
        expense: 400,
        transfer: 0,
        adjustment: 0,
        net: 600,
        totalNetWorth: 50000,
        excludedNetWorth: 10000,
      };
      vi.mocked(http.get).mockResolvedValueOnce({ data: mockResponse });

      const result = await getTodaySummaryApi();
      expect(http.get).toHaveBeenCalledWith("/summary/today");
      expect(result).toEqual(mockResponse);
    });

    it("fetches monthly summary via http.get", async () => {
      const mockResponse = {
        income: 20000,
        expense: 8000,
        transfer: 1000,
        adjustment: 0,
        net: 12000,
        totalNetWorth: 50000,
        excludedNetWorth: 10000,
      };
      vi.mocked(http.get).mockResolvedValueOnce({ data: mockResponse });

      const result = await getThisMonthSummaryApi();
      expect(http.get).toHaveBeenCalledWith("/summary/monthly");
      expect(result).toEqual(mockResponse);
    });
  });
});
