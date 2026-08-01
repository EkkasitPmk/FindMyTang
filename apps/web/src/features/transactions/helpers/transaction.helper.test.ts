import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  submitTransaction,
  resolveDefaultTransactionType,
  createDefaultFormValues,
  getActiveItemId,
  getTypeLabel,
  parseErrorMessage,
  checkIsLoading,
  checkIsTxLoading,
  checkIsSubmitting,
  isCategoryType,
  getLoadingModalProps,
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
});
