import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  submitTransaction,
  resolveDefaultTransactionType,
  createDefaultFormValues,
  getActiveItemId,
  getTypeLabel,
  getTransactionTypeOptions,
  parseErrorMessage,
  checkIsLoading,
  checkIsTxLoading,
  checkIsSubmitting,
  isCategoryType,
  getLoadingModalProps,
  getRecentAssetIds,
  saveRecentAssetId,
  sortAssetsByRecent,
  RECENT_ASSET_IDS_KEY,
  MAX_RECENT_ASSETS,
} from "./transaction.helper";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

describe("transaction.helper", () => {
  describe("submitTransaction", () => {
    let mockCreateMutate: ReturnType<typeof vi.fn>;
    let mockUpdateMutate: ReturnType<typeof vi.fn>;
    let mockToastError: ReturnType<typeof vi.fn>;
    let mockTranslate: Parameters<typeof submitTransaction>[0]["t"];

    let mockCreateTransaction: Parameters<
      typeof submitTransaction
    >[0]["createTransaction"];
    let mockUpdateTransaction: Parameters<
      typeof submitTransaction
    >[0]["updateTransaction"];
    let mockToast: NonNullable<
      Parameters<typeof submitTransaction>[0]["toast"]
    >;

    beforeEach(() => {
      mockCreateMutate = vi.fn();
      mockUpdateMutate = vi.fn();
      mockToastError = vi.fn();
      mockTranslate = vi.fn((key: TranslationKey) =>
        key === "errSelectTargetAsset"
          ? "Please select a target asset"
          : "Please select a category",
      );

      mockCreateTransaction = {
        mutate: mockCreateMutate,
      } as unknown as typeof mockCreateTransaction;
      mockUpdateTransaction = {
        mutate: mockUpdateMutate,
      } as unknown as typeof mockUpdateTransaction;
      mockToast = { error: mockToastError } as unknown as typeof mockToast;
    });

    it("should show error if TRANSFER is missing toAssetId", () => {
      submitTransaction({
        transactionType: "TRANSFER",
        data: {
          amount: 100,
          note: "",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
        },
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockToastError).toHaveBeenCalledWith(
        "Please select a target asset",
      );
      expect(mockCreateMutate).not.toHaveBeenCalled();
    });

    it("should allow external TRANSFER when toAssetId is EXTERNAL", () => {
      submitTransaction({
        transactionType: "TRANSFER",
        data: {
          amount: 500,
          note: "Paid friend",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: "EXTERNAL",
        },
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockToastError).not.toHaveBeenCalled();
      expect(mockCreateMutate).toHaveBeenCalledWith({
        type: "TRANSFER",
        data: {
          amount: 500,
          note: "Paid friend",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: undefined,
          categoryId: undefined,
          file: undefined,
        },
      });
    });

    it("should allow external TRANSFER with optional categoryId", () => {
      submitTransaction({
        transactionType: "TRANSFER",
        data: {
          amount: 500,
          note: "Paid friend",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: "EXTERNAL",
          categoryId: "cat-1",
        },
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockToastError).not.toHaveBeenCalled();
      expect(mockCreateMutate).toHaveBeenCalledWith({
        type: "TRANSFER",
        data: {
          amount: 500,
          note: "Paid friend",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: undefined,
          categoryId: "cat-1",
          file: undefined,
        },
      });
    });

    it("should strip categoryId for internal TRANSFER", () => {
      submitTransaction({
        transactionType: "TRANSFER",
        data: {
          amount: 500,
          note: "Internal move",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: "asset-2",
          categoryId: "cat-1",
        },
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockToastError).not.toHaveBeenCalled();
      expect(mockCreateMutate).toHaveBeenCalledWith({
        type: "TRANSFER",
        data: {
          amount: 500,
          note: "Internal move",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: "asset-2",
          categoryId: undefined,
          file: undefined,
        },
      });
    });

    it("should show error if EXPENSE is missing categoryId", () => {
      submitTransaction({
        transactionType: "EXPENSE",
        data: {
          amount: 100,
          note: "",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
        },
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockToastError).toHaveBeenCalledWith("Please select a category");
      expect(mockCreateMutate).not.toHaveBeenCalled();
    });

    it("should call createTransaction for valid new transaction", () => {
      const data = {
        amount: 100,
        note: "Food",
        transactionDate: "2026-07-08T00:00:00.000Z",
        assetId: "asset-1",
        categoryId: "cat-1",
      };

      submitTransaction({
        transactionType: "EXPENSE",
        data,
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockCreateMutate).toHaveBeenCalledWith({
        type: "EXPENSE",
        data: { ...data, file: undefined },
      });
    });

    it("should not save recent asset id when assetId is empty", () => {
      const data = {
        amount: 100,
        note: "Balance adjustment",
        transactionDate: "2026-07-08T00:00:00.000Z",
        assetId: "",
      };

      submitTransaction({
        transactionType: "ADJUSTMENT",
        data,
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockCreateMutate).toHaveBeenCalled();
    });

    it("should call updateTransaction for editing transaction", () => {
      const data = {
        amount: 200,
        note: "Updated",
        transactionDate: "2026-07-08T00:00:00.000Z",
        assetId: "asset-1",
        categoryId: "cat-1",
      };

      submitTransaction({
        transactionType: "INCOME",
        data,
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        editId: "tx-1",
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockUpdateMutate).toHaveBeenCalledWith({
        id: "tx-1",
        data: {
          type: "INCOME",
          assetId: "asset-1",
          amount: 200,
          note: "Updated",
          transactionDate: data.transactionDate,
          toAssetId: undefined,
          categoryId: "cat-1",
          attachmentUrl: undefined,
          file: null,
        },
      });
    });

    it("should build update payload for external transfer with removedAttachment and file", () => {
      const mockFile = new File(["test"], "test.png", { type: "image/png" });
      const data = {
        amount: 200,
        note: "Updated",
        transactionDate: "2026-07-08T00:00:00.000Z",
        assetId: "asset-1",
        toAssetId: "EXTERNAL",
      };

      submitTransaction({
        transactionType: "TRANSFER",
        data,
        file: mockFile,
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        editId: "tx-1",
        removedAttachment: true,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(mockUpdateMutate).toHaveBeenCalledWith({
        id: "tx-1",
        data: {
          type: "TRANSFER",
          assetId: "asset-1",
          amount: 200,
          note: "Updated",
          transactionDate: data.transactionDate,
          toAssetId: null,
          categoryId: null,
          attachmentUrl: null,
          file: mockFile,
        },
      });
    });

    it("should save assetId to recent assets only when saving succeeds", () => {
      window.localStorage.clear();

      submitTransaction({
        transactionType: "EXPENSE",
        data: {
          amount: 50,
          note: "Coffee",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-coffee",
          categoryId: "cat-1",
        },
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(getRecentAssetIds()).toEqual(["asset-coffee"]);
    });

    it("should save both assetId and toAssetId for transfer when saving", () => {
      window.localStorage.clear();

      submitTransaction({
        transactionType: "TRANSFER",
        data: {
          amount: 1000,
          note: "Transfer",
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-from",
          toAssetId: "asset-to",
        },
        createTransaction: mockCreateTransaction,
        updateTransaction: mockUpdateTransaction,
        toast: mockToast,
        t: mockTranslate,
      });

      expect(getRecentAssetIds()).toEqual(["asset-to", "asset-from"]);
    });
  });

  describe("resolveDefaultTransactionType", () => {
    it("should return existing transaction type if provided", () => {
      const mockTx = { type: "TRANSFER" } as TransactionResponse;
      expect(resolveDefaultTransactionType(mockTx, "EXPENSE")).toBe("TRANSFER");
    });

    it("should return valid typeParam if provided", () => {
      expect(resolveDefaultTransactionType(undefined, "INCOME")).toBe("INCOME");
    });

    it("should default to EXPENSE for invalid typeParam", () => {
      expect(resolveDefaultTransactionType(undefined, "INVALID")).toBe(
        "EXPENSE",
      );
    });

    it("should default to EXPENSE if nothing provided", () => {
      expect(resolveDefaultTransactionType()).toBe("EXPENSE");
    });
  });

  describe("createDefaultFormValues", () => {
    it("should return empty defaults when no args", () => {
      const values = createDefaultFormValues();
      expect(values.amount).toBe(0);
      expect(values.note).toBe("");
      expect(values.assetId).toBe("");
      expect(values.categoryId).toBe("");
      expect(values.toAssetId).toBe("");
    });

    it("should populate values from existing transaction", () => {
      const mockTx = {
        amount: 50,
        note: "Test note",
        transactionDate: "2026-01-01T00:00:00.000Z",
        assetId: "asset-123",
        categoryId: "cat-456",
        toAssetId: "asset-789",
      } as TransactionResponse;

      const values = createDefaultFormValues(mockTx);
      expect(values.amount).toBe(50);
      expect(values.note).toBe("Test note");
      expect(values.transactionDate).toBe("2026-01-01T00:00:00.000Z");
      expect(values.assetId).toBe("asset-123");
      expect(values.categoryId).toBe("cat-456");
      expect(values.toAssetId).toBe("asset-789");
    });

    it("should set toAssetId to EXTERNAL for existing TRANSFER without toAssetId", () => {
      const mockTx = {
        amount: 300,
        note: "Transfer out",
        transactionDate: "2026-07-08T12:00:00.000Z",
        assetId: "asset-1",
        type: "TRANSFER",
      } as unknown as TransactionResponse;

      const values = createDefaultFormValues(mockTx);
      expect(values.toAssetId).toBe("EXTERNAL");
    });
  });

  describe("getActiveItemId", () => {
    it("should return watchId if it exists in items", () => {
      const items = [{ id: "1" }, { id: "2" }];
      expect(getActiveItemId("2", items)).toBe("2");
    });

    it("should return first item id if watchId not found", () => {
      const items = [{ id: "1" }, { id: "2" }];
      expect(getActiveItemId("3", items)).toBe("1");
    });

    it("should return fallbackId if items is empty and watchId not found", () => {
      expect(getActiveItemId("3", [], "fallback")).toBe("fallback");
    });
  });

  describe("getTypeLabel", () => {
    it("should return translated label when key exists", () => {
      const mockT = vi.fn((k) => `translated_${k}`);
      expect(getTypeLabel("EXPENSE", mockT)).toBe("translated_expense");
    });

    it("should return lowercase type when key is not found", () => {
      const mockT = vi.fn((k) => k);
      expect(getTypeLabel("UNKNOWN", mockT)).toBe("unknown");
    });
  });

  describe("parseErrorMessage", () => {
    it("should return first message from array if message is an array", () => {
      const err = {
        response: { data: { message: ["Array error"] } },
      } as unknown as Parameters<typeof parseErrorMessage>[0];
      expect(parseErrorMessage(err, "fallback")).toBe("Array error");
    });

    it("should return message string if available", () => {
      const err = {
        response: { data: { message: "String error" } },
      } as unknown as Parameters<typeof parseErrorMessage>[0];
      expect(parseErrorMessage(err, "fallback")).toBe("String error");
    });

    it("should return fallback when response error message is missing", () => {
      const err = {} as unknown as Parameters<typeof parseErrorMessage>[0];
      expect(parseErrorMessage(err, "fallback")).toBe("fallback");
    });
  });

  describe("loading and status helpers", () => {
    it("checkIsLoading should check isPending and isFetching", () => {
      expect(checkIsLoading(false, false)).toBe(false);
      expect(checkIsLoading(true, false)).toBe(true);
      expect(checkIsLoading(false, true)).toBe(true);
      expect(checkIsLoading(false, false)).toBe(false);
    });

    it("checkIsTxLoading should return true only if editId exists and loading", () => {
      expect(checkIsTxLoading(null, true)).toBe(false);
      expect(checkIsTxLoading("tx-1", true)).toBe(true);
      expect(checkIsTxLoading("tx-1", false)).toBe(false);
    });

    it("checkIsSubmitting should return true if any mutation pending", () => {
      expect(checkIsSubmitting(true, false, false)).toBe(true);
      expect(checkIsSubmitting(false, true, false)).toBe(true);
      expect(checkIsSubmitting(false, false, true)).toBe(true);
      expect(checkIsSubmitting(false, false, false)).toBe(false);
    });

    it("isCategoryType should correctly identify EXPENSE and INCOME", () => {
      expect(isCategoryType("EXPENSE")).toBe(true);
      expect(isCategoryType("INCOME")).toBe(true);
      expect(isCategoryType("TRANSFER")).toBe(false);
      expect(isCategoryType("ADJUSTMENT")).toBe(false);
    });

    it("getLoadingModalProps should format props correctly", () => {
      const modalState = {
        isOpen: true,
        status: "success" as const,
        message: "Done",
      };
      expect(getLoadingModalProps(modalState, false)).toEqual({
        isOpen: true,
        status: "success",
        message: "Done",
      });

      const closedModal = { isOpen: false, status: "loading" as const };
      expect(getLoadingModalProps(closedModal, true)).toEqual({
        isOpen: true,
        status: "loading",
        message: undefined,
      });
    });
  });

  describe("getTransactionTypeOptions", () => {
    it("returns all 4 types when editId is not provided", () => {
      const opts = getTransactionTypeOptions(undefined, undefined);
      expect(opts).toEqual([
        { label: "expense", value: "EXPENSE" },
        { label: "income", value: "INCOME" },
        { label: "transfer", value: "TRANSFER" },
        { label: "adjustment", value: "ADJUSTMENT" },
      ]);
    });

    it("returns only TRANSFER option when editing TRANSFER", () => {
      const opts = getTransactionTypeOptions("tx-1", "TRANSFER");
      expect(opts).toEqual([{ label: "transfer", value: "TRANSFER" }]);
    });

    it("returns only ADJUSTMENT option when editing ADJUSTMENT", () => {
      const opts = getTransactionTypeOptions("tx-1", "ADJUSTMENT");
      expect(opts).toEqual([{ label: "adjustment", value: "ADJUSTMENT" }]);
    });

    it("returns EXPENSE and INCOME options when editing EXPENSE or INCOME", () => {
      const optsExpense = getTransactionTypeOptions("tx-1", "EXPENSE");
      expect(optsExpense).toEqual([
        { label: "expense", value: "EXPENSE" },
        { label: "income", value: "INCOME" },
      ]);

      const optsIncome = getTransactionTypeOptions("tx-1", "INCOME");
      expect(optsIncome).toEqual([
        { label: "expense", value: "EXPENSE" },
        { label: "income", value: "INCOME" },
      ]);
    });

    it("falls through to all options when editId exists but existingType is unknown/undefined", () => {
      const opts = getTransactionTypeOptions("tx-1", undefined);
      expect(opts).toHaveLength(4);
    });
  });

  describe("recent assets helper", () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    describe("getRecentAssetIds", () => {
      it("returns empty array when window is undefined (SSR)", () => {
        const origWindow = globalThis.window;
        vi.stubGlobal("window", undefined);
        expect(getRecentAssetIds()).toEqual([]);
        expect(saveRecentAssetId("asset-1")).toEqual([]);
        vi.stubGlobal("window", origWindow);
      });

      it("returns empty array when nothing is stored", () => {
        expect(getRecentAssetIds()).toEqual([]);
      });

      it("returns stored array of string IDs", () => {
        window.localStorage.setItem(
          RECENT_ASSET_IDS_KEY,
          JSON.stringify(["asset-1", "asset-2"]),
        );
        expect(getRecentAssetIds()).toEqual(["asset-1", "asset-2"]);
      });

      it("filters out non-string items and handles invalid JSON gracefully", () => {
        window.localStorage.setItem(
          RECENT_ASSET_IDS_KEY,
          JSON.stringify(["asset-1", 123, null, "asset-2"]),
        );
        expect(getRecentAssetIds()).toEqual(["asset-1", "asset-2"]);

        window.localStorage.setItem(RECENT_ASSET_IDS_KEY, "invalid-json{");
        expect(getRecentAssetIds()).toEqual([]);

        window.localStorage.setItem(
          RECENT_ASSET_IDS_KEY,
          JSON.stringify({ not: "an array" }),
        );
        expect(getRecentAssetIds()).toEqual([]);
      });
    });

    describe("saveRecentAssetId", () => {
      it("saves new asset id to front and caps at MAX_RECENT_ASSETS", () => {
        saveRecentAssetId("asset-1");
        saveRecentAssetId("asset-2");
        saveRecentAssetId("asset-3");
        const res = saveRecentAssetId("asset-4");

        expect(res).toEqual(["asset-4", "asset-3", "asset-2"]);
        expect(res).toHaveLength(MAX_RECENT_ASSETS);
      });

      it("moves existing asset id to front without duplicating", () => {
        saveRecentAssetId("asset-1");
        saveRecentAssetId("asset-2");
        saveRecentAssetId("asset-3");

        const updated = saveRecentAssetId("asset-2");
        expect(updated).toEqual(["asset-2", "asset-3", "asset-1"]);
      });

      it("ignores empty or EXTERNAL asset ID", () => {
        saveRecentAssetId("asset-1");
        const resEmpty = saveRecentAssetId("");
        const resExternal = saveRecentAssetId("EXTERNAL");

        expect(resEmpty).toEqual(["asset-1"]);
        expect(resExternal).toEqual(["asset-1"]);
      });

      it("returns empty array when localStorage.setItem throws", () => {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
          throw new Error("Quota exceeded");
        });
        const res = saveRecentAssetId("asset-1");
        expect(res).toEqual([]);
      });
    });

    describe("sortAssetsByRecent", () => {
      const mockAssets = [
        { id: "asset-1", name: "Cash" },
        { id: "asset-2", name: "Bank" },
        { id: "asset-3", name: "Crypto" },
        { id: "asset-4", name: "Savings" },
      ];

      it("returns original assets if recentIds is empty", () => {
        expect(sortAssetsByRecent(mockAssets, [])).toEqual(mockAssets);
      });

      it("returns empty array if assets list is empty", () => {
        expect(sortAssetsByRecent([], ["asset-1"])).toEqual([]);
      });

      it("sorts assets with recent IDs first in order of recency, keeping remaining in original order", () => {
        const sorted = sortAssetsByRecent(mockAssets, ["asset-3", "asset-1"]);
        expect(sorted.map((a) => a.id)).toEqual([
          "asset-3",
          "asset-1",
          "asset-2",
          "asset-4",
        ]);
      });

      it("gracefully ignores recent IDs that do not exist in the assets array", () => {
        const sorted = sortAssetsByRecent(mockAssets, [
          "deleted-asset",
          "asset-4",
        ]);
        expect(sorted.map((a) => a.id)).toEqual([
          "asset-4",
          "asset-1",
          "asset-2",
          "asset-3",
        ]);
      });
    });
  });
});
