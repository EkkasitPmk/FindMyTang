import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTransactionSelections } from "./useTransactionSelections.hook";
import { Asset, AssetType } from "@/shared/lib/types/asset.type";
import { Category } from "@/shared/lib/types/category.type";

const mockAssets: Asset[] = [
  {
    id: "asset-active-1",
    name: "Active Wallet",
    type: AssetType.CASH,
    balance: 1000,
    isArchived: false,
    includeInSnapshot: true,
    savingsAmount: 0,
    deletedAt: null,
  },
  {
    id: "asset-active-2",
    name: "Active Bank",
    type: AssetType.BANK,
    balance: 2000,
    isArchived: false,
    includeInSnapshot: true,
    savingsAmount: 0,
    deletedAt: null,
  },
  {
    id: "asset-archived-1",
    name: "Archived Bank",
    type: AssetType.BANK,
    balance: 500,
    isArchived: true,
    includeInSnapshot: true,
    savingsAmount: 0,
    deletedAt: null,
  },
  {
    id: "asset-deleted-1",
    name: "Deleted Wallet",
    type: AssetType.CASH,
    balance: 0,
    isArchived: false,
    includeInSnapshot: false,
    savingsAmount: 0,
    deletedAt: "2026-01-01T00:00:00.000Z",
  },
];

const mockCategories: Category[] = [
  {
    id: "cat-expense-1",
    name: "Food",
    type: "EXPENSE",
    isSystem: false,
    deletedAt: null,
  },
  {
    id: "cat-expense-deleted",
    name: "Old Category",
    type: "EXPENSE",
    isSystem: false,
    deletedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cat-income-1",
    name: "Salary",
    type: "INCOME",
    isSystem: false,
    deletedAt: null,
  },
];

let mockCategoriesData: {
  data: Category[] | undefined;
  isPending: boolean;
  isFetching: boolean;
} = {
  data: mockCategories,
  isPending: false,
  isFetching: false,
};

let mockAssetsData: {
  data: Asset[] | undefined;
  isPending: boolean;
  isFetching: boolean;
} = {
  data: mockAssets,
  isPending: false,
  isFetching: false,
};

vi.mock("@/shared/lib/hooks/useCategories.hook", () => ({
  useCategories: () => mockCategoriesData,
}));

vi.mock("@/shared/lib/hooks/useAssets.hook", () => ({
  useAssets: () => mockAssetsData,
}));

describe("useTransactionSelections", () => {
  const setValue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCategoriesData = {
      data: mockCategories,
      isPending: false,
      isFetching: false,
    };
    mockAssetsData = {
      data: mockAssets,
      isPending: false,
      isFetching: false,
    };
  });

  describe("Assets filtering & selection", () => {
    it("filters out archived and deleted assets by default", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "EXPENSE",
          watchCategoryId: undefined,
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      const assetIds = result.current.safeAssets.map((a) => a.id);
      expect(assetIds).toEqual(["asset-active-1", "asset-active-2"]);
    });

    it("includes archived asset when selected as watchAssetId", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "EXPENSE",
          watchCategoryId: undefined,
          watchAssetId: "asset-archived-1",
          watchToAssetId: undefined,
          setValue,
        }),
      );

      const assetIds = result.current.safeAssets.map((a) => a.id);
      expect(assetIds).toContain("asset-archived-1");
      expect(result.current.activeAssetId).toBe("asset-archived-1");
    });

    it("includes archived asset when selected as destination asset (watchToAssetId)", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "TRANSFER",
          watchCategoryId: undefined,
          watchAssetId: "asset-active-1",
          watchToAssetId: "asset-archived-1",
          setValue,
        }),
      );

      const assetIds = result.current.safeAssets.map((a) => a.id);
      expect(assetIds).toContain("asset-archived-1");
      expect(result.current.activeAssetToId).toBe("asset-archived-1");
    });

    it("includes deleted asset when selected as watchAssetId", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "EXPENSE",
          watchCategoryId: undefined,
          watchAssetId: "asset-deleted-1",
          watchToAssetId: undefined,
          setValue,
        }),
      );

      const assetIds = result.current.safeAssets.map((a) => a.id);
      expect(assetIds).toContain("asset-deleted-1");
      expect(result.current.activeAssetId).toBe("asset-deleted-1");
    });

    it("handles undefined assets gracefully", () => {
      mockAssetsData = {
        data: undefined,
        isPending: false,
        isFetching: false,
      };

      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "EXPENSE",
          watchCategoryId: undefined,
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(result.current.safeAssets).toEqual([]);
      expect(result.current.activeAssetId).toBeNull();
      expect(result.current.activeAssetToId).toBe("EXTERNAL");
    });
  });

  describe("Destination asset (watchToAssetId) handling", () => {
    it("returns EXTERNAL when watchToAssetId is EXTERNAL", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "TRANSFER",
          watchCategoryId: undefined,
          watchAssetId: "asset-active-1",
          watchToAssetId: "EXTERNAL",
          setValue,
        }),
      );

      expect(result.current.activeAssetToId).toBe("EXTERNAL");
    });

    it("auto-selects first available destination asset when watchToAssetId is not specified", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "TRANSFER",
          watchCategoryId: undefined,
          watchAssetId: "asset-active-1",
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(result.current.activeAssetToId).toBe("asset-active-2");
    });

    it("returns EXTERNAL when no available destination assets exist", () => {
      mockAssetsData = {
        data: [mockAssets[0]], // only one active asset
        isPending: false,
        isFetching: false,
      };

      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "TRANSFER",
          watchCategoryId: undefined,
          watchAssetId: "asset-active-1",
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(result.current.activeAssetToId).toBe("EXTERNAL");
    });
  });

  describe("Category filtering & selection", () => {
    it("filters categories by transactionType EXPENSE and hides deleted categories", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "EXPENSE",
          watchCategoryId: undefined,
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      const categoryIds = result.current.filteredCategories.map((c) => c.id);
      expect(categoryIds).toEqual(["cat-expense-1"]);
      expect(result.current.activeCategoryId).toBe("cat-expense-1");
    });

    it("filters categories for INCOME transactionType", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "INCOME",
          watchCategoryId: undefined,
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      const categoryIds = result.current.filteredCategories.map((c) => c.id);
      expect(categoryIds).toEqual(["cat-income-1"]);
      expect(result.current.activeCategoryId).toBe("cat-income-1");
    });

    it("includes deleted category if it matches watchCategoryId", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "EXPENSE",
          watchCategoryId: "cat-expense-deleted",
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      const categoryIds = result.current.filteredCategories.map((c) => c.id);
      expect(categoryIds).toContain("cat-expense-deleted");
      expect(result.current.activeCategoryId).toBe("cat-expense-deleted");
    });

    it("maps targetCategoryType to EXPENSE in TRANSFER mode", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "TRANSFER",
          watchCategoryId: "cat-expense-1",
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(result.current.activeCategoryId).toBe("cat-expense-1");
    });

    it("returns null activeCategoryId in TRANSFER mode if watchCategoryId not in filteredCategories", () => {
      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "TRANSFER",
          watchCategoryId: "non-existent-cat",
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(result.current.activeCategoryId).toBeNull();
    });

    it("handles undefined categories gracefully", () => {
      mockCategoriesData = {
        data: undefined,
        isPending: false,
        isFetching: false,
      };

      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "EXPENSE",
          watchCategoryId: undefined,
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(result.current.filteredCategories).toEqual([]);
      expect(result.current.activeCategoryId).toBeNull();
    });
  });

  describe("Loading flags", () => {
    it("reports loading states correctly", () => {
      mockCategoriesData = {
        data: [],
        isPending: true,
        isFetching: false,
      };
      mockAssetsData = {
        data: [],
        isPending: false,
        isFetching: true,
      };

      const { result } = renderHook(() =>
        useTransactionSelections({
          transactionType: "EXPENSE",
          watchCategoryId: undefined,
          watchAssetId: undefined,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(result.current.isLoadingCategoryList).toBe(true);
      expect(result.current.isLoadingAssetList).toBe(true);
    });
  });
});
