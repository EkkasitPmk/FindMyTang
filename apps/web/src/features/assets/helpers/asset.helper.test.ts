import { describe, it, expect, vi } from "vitest";
import {
  getAssetItemStatus,
  getListBottomPaddingClass,
  getManageAssetItemClasses,
  processAssetTransactions,
  reorderList,
  toggleSelectedId,
} from "./asset.helper";
import {
  TransactionResponse,
  TransactionType,
} from "@/shared/lib/types/transaction.type";
import { formatDisplayDate } from "@/shared/lib/helpers/date.helper";
import { Asset } from "@/shared/lib/types/asset.type";

vi.mock("react-toastify", () => ({ toast: { error: vi.fn() } }));

describe("asset.helper", () => {
  describe("toggleSelectedId", () => {
    it("toggles selected asset IDs without mutating the original set", () => {
      const selectedIds = new Set(["asset-1"]);

      expect(toggleSelectedId(selectedIds, "asset-1")).toEqual(new Set());
      expect(toggleSelectedId(selectedIds, "asset-2")).toEqual(
        new Set(["asset-1", "asset-2"]),
      );
      expect(selectedIds).toEqual(new Set(["asset-1"]));
    });
  });

  describe("getListBottomPaddingClass", () => {
    it("returns correct padding class depending on isEditingList and embedded", () => {
      expect(getListBottomPaddingClass(false, false)).toBe("pb-4");
      expect(getListBottomPaddingClass(false, true)).toBe("pb-4");
      expect(getListBottomPaddingClass(true, false)).toBe("pb-20");
      expect(getListBottomPaddingClass(true, true)).toBe("pb-20 lg:pb-4");
    });
  });

  describe("reorderList", () => {
    it("moves an item from startIndex to endIndex without mutating original list", () => {
      const list = [
        { id: "1", name: "A" } as Asset,
        { id: "2", name: "B" } as Asset,
        { id: "3", name: "C" } as Asset,
      ];
      const result = reorderList(list, 0, 2);
      expect(result.map((a) => a.id)).toEqual(["2", "3", "1"]);
      expect(list.map((a) => a.id)).toEqual(["1", "2", "3"]);
    });
  });

  describe("getAssetItemStatus", () => {
    it("returns active status with iconStyle and containerStyle when active and has color", () => {
      const asset = {
        id: "a1",
        color: "#2563EB",
        isArchived: false,
      } as Asset;

      const status = getAssetItemStatus(asset, 0, 1);
      expect(status.isDeleted).toBe(false);
      expect(status.isArchived).toBe(false);
      expect(status.isInactive).toBe(false);
      expect(status.isBeingDragged).toBe(false);
      expect(status.iconStyle).toEqual({
        backgroundColor: "#2563EB1a",
        color: "#2563EB",
      });
      expect(status.containerStyle).toEqual({
        borderLeftColor: "#2563EB",
      });
    });

    it("returns transparent border when active asset has no color", () => {
      const asset = {
        id: "a1",
        color: "",
        isArchived: false,
      } as Asset;

      const status = getAssetItemStatus(asset);
      expect(status.iconStyle).toBeUndefined();
      expect(status.containerStyle).toEqual({
        borderLeftColor: "transparent",
      });
    });

    it("identifies deleted asset and clears styles", () => {
      const asset = {
        id: "a1",
        deletedAt: new Date().toISOString(),
        isArchived: true,
      } as Asset;

      const status = getAssetItemStatus(asset);
      expect(status.isDeleted).toBe(true);
      expect(status.isArchived).toBe(false);
      expect(status.isInactive).toBe(true);
      expect(status.iconStyle).toBeUndefined();
      expect(status.containerStyle).toBeUndefined();
    });

    it("identifies archived asset when not deleted", () => {
      const asset = {
        id: "a1",
        isArchived: true,
      } as Asset;

      const status = getAssetItemStatus(asset);
      expect(status.isDeleted).toBe(false);
      expect(status.isArchived).toBe(true);
      expect(status.isInactive).toBe(true);
    });

    it("identifies when an item is being dragged", () => {
      const asset = { id: "a1" } as Asset;
      expect(getAssetItemStatus(asset, 2, 2).isBeingDragged).toBe(true);
      expect(getAssetItemStatus(asset, 2, null).isBeingDragged).toBe(false);
      expect(getAssetItemStatus(asset, 2, undefined).isBeingDragged).toBe(
        false,
      );
    });
  });

  describe("getManageAssetItemClasses", () => {
    it("returns classes for deleted item", () => {
      const result = getManageAssetItemClasses({
        isDeleted: true,
        isArchived: false,
        isInactive: true,
        isExpanded: false,
        isEditingList: false,
        isSelected: false,
        draggable: true,
        hasColor: false,
        isBeingDragged: true,
      });

      expect(result.titleClass).toBe("text-disabled-text line-through");
      expect(result.containerClasses).toContain("cursor-grab");
      expect(result.containerClasses).toContain("border-dashed");
      expect(result.balanceClass).toContain("text-disabled-text");
    });

    it("returns classes for archived item", () => {
      const result = getManageAssetItemClasses({
        isDeleted: false,
        isArchived: true,
        isInactive: true,
        isExpanded: false,
        isEditingList: false,
        isSelected: false,
        draggable: false,
        hasColor: false,
      });

      expect(result.titleClass).toBe("text-disabled-text");
    });

    it("returns classes when expanded and not editing list", () => {
      const result = getManageAssetItemClasses({
        isDeleted: false,
        isArchived: false,
        isInactive: false,
        isExpanded: true,
        isEditingList: false,
        isSelected: false,
        draggable: false,
        hasColor: true,
      });

      expect(result.rowBgClass).toBe("bg-surface-secondary");
      expect(result.iconBgClass).toBe("p-2.5 rounded-full");
    });

    it("returns classes when editing list and selected", () => {
      const result = getManageAssetItemClasses({
        isDeleted: false,
        isArchived: false,
        isInactive: false,
        isExpanded: false,
        isEditingList: true,
        isSelected: true,
        draggable: false,
        hasColor: true,
      });

      expect(result.rowBgClass).toBe("bg-primary/10");
    });

    it("does not keep expanded highlighting while selecting assets", () => {
      const result = getManageAssetItemClasses({
        isDeleted: false,
        isArchived: false,
        isInactive: false,
        isExpanded: true,
        isEditingList: true,
        isSelected: false,
        draggable: false,
        hasColor: true,
      });

      expect(result.headerClasses).not.toContain("bg-surface-secondary");
    });
  });

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

    it("processes transactions in search mode", () => {
      const mockTransactions: TransactionResponse[] = [
        {
          id: "1",
          type: "INCOME" as TransactionType,
          amount: 100,
          transactionDate: "2026-07-15T00:00:00.000Z",
          assetId: "a1",
          note: "Found bonus",
          createdAt: "",
          updatedAt: "",
        },
      ];

      const result = processAssetTransactions({
        transactions: mockTransactions,
        selectedYear: "2026",
        selectedMonth: "July",
        isSearchMode: true,
        searchKeyword: "bonus",
      });

      expect(result.effectiveYear).toBe("2026");
      expect(result.filteredItems).toHaveLength(1);
    });
  });
});
