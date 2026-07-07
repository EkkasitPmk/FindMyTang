import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  submitTransaction,
  resolveDefaultTransactionType,
  createDefaultFormValues,
  getActiveItemId,
  getTransactionTypeOptions,
} from "./transaction.helper";
import { TransactionResponse } from "../types/transaction.type";

describe("transaction.helper", () => {
  describe("submitTransaction", () => {
    let mockCreateMutate: ReturnType<typeof vi.fn>;
    let mockUpdateMutate: ReturnType<typeof vi.fn>;
    let mockToastError: ReturnType<typeof vi.fn>;

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

  describe("getTransactionTypeOptions", () => {
    it("should return limited options for editing TRANSFER", () => {
      const options = getTransactionTypeOptions("edit-id", "TRANSFER");
      expect(options).toEqual([{ label: "Transfer", value: "TRANSFER" }]);
    });

    it("should return limited options for editing ADJUSTMENT", () => {
      const options = getTransactionTypeOptions("edit-id", "ADJUSTMENT");
      expect(options).toEqual([{ label: "Adjustment", value: "ADJUSTMENT" }]);
    });

    it("should return Expense and Income for editing EXPENSE or INCOME", () => {
      const options1 = getTransactionTypeOptions("edit-id", "EXPENSE");
      expect(options1).toEqual([
        { label: "Expense", value: "EXPENSE" },
        { label: "Income", value: "INCOME" },
      ]);
    });

    it("should return all options when not editing", () => {
      const options = getTransactionTypeOptions(null, undefined);
      expect(options).toEqual([
        { label: "Expense", value: "EXPENSE" },
        { label: "Income", value: "INCOME" },
        { label: "Transfer", value: "TRANSFER" },
        { label: "Adjustment", value: "ADJUSTMENT" },
      ]);
    });
  });
});
