import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  useTransactionFormSync,
  useTransactionInitialization,
} from "./transaction-form.hook";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";

describe("transaction-form.hook", () => {
  describe("useTransactionFormSync", () => {
    it("updates categoryId when activeCategoryId differs and type is EXPENSE or INCOME", () => {
      const setValue = vi.fn();
      renderHook(() =>
        useTransactionFormSync({
          transactionType: "EXPENSE",
          activeCategoryId: "cat-1",
          watchCategoryId: undefined,
          activeAssetId: "asset-1",
          watchAssetId: "asset-1",
          activeAssetToId: null,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(setValue).toHaveBeenCalledWith("categoryId", "cat-1", {
        shouldValidate: false,
        shouldTouch: false,
      });
    });

    it("does not update categoryId in TRANSFER mode or when matching", () => {
      const setValue = vi.fn();
      renderHook(() =>
        useTransactionFormSync({
          transactionType: "TRANSFER",
          activeCategoryId: "cat-1",
          watchCategoryId: undefined,
          activeAssetId: "asset-1",
          watchAssetId: "asset-1",
          activeAssetToId: null,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(setValue).not.toHaveBeenCalledWith(
        "categoryId",
        expect.anything(),
        expect.anything(),
      );
    });

    it("updates assetId when activeAssetId differs from watchAssetId", () => {
      const setValue = vi.fn();
      renderHook(() =>
        useTransactionFormSync({
          transactionType: "EXPENSE",
          activeCategoryId: "cat-1",
          watchCategoryId: "cat-1",
          activeAssetId: "asset-2",
          watchAssetId: "asset-1",
          activeAssetToId: null,
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(setValue).toHaveBeenCalledWith("assetId", "asset-2", {
        shouldValidate: false,
        shouldTouch: false,
      });
    });

    it("updates toAssetId in TRANSFER mode when activeAssetToId differs", () => {
      const setValue = vi.fn();
      renderHook(() =>
        useTransactionFormSync({
          transactionType: "TRANSFER",
          activeCategoryId: null,
          watchCategoryId: undefined,
          activeAssetId: "asset-1",
          watchAssetId: "asset-1",
          activeAssetToId: "asset-2",
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(setValue).toHaveBeenCalledWith("toAssetId", "asset-2", {
        shouldValidate: false,
        shouldTouch: false,
      });
    });

    it("does not update toAssetId if type is EXPENSE even if activeAssetToId is set", () => {
      const setValue = vi.fn();
      renderHook(() =>
        useTransactionFormSync({
          transactionType: "EXPENSE",
          activeCategoryId: "cat-1",
          watchCategoryId: "cat-1",
          activeAssetId: "asset-1",
          watchAssetId: "asset-1",
          activeAssetToId: "asset-2",
          watchToAssetId: undefined,
          setValue,
        }),
      );

      expect(setValue).not.toHaveBeenCalledWith(
        "toAssetId",
        expect.anything(),
        expect.anything(),
      );
    });
  });

  describe("useTransactionInitialization", () => {
    const mockTx: TransactionResponse = {
      id: "tx-123",
      type: "EXPENSE",
      amount: 250,
      note: "Coffee",
      transactionDate: "2026-05-10T12:00:00.000Z",
      assetId: "asset-1",
      categoryId: "cat-1",
      attachmentUrl: null,
      createdAt: "2026-05-10T12:00:00.000Z",
      updatedAt: "2026-05-10T12:00:00.000Z",
      deletedAt: null,
    };

    it("populates state when existingTx arrives with new ID", () => {
      const setPrevTxId = vi.fn();
      const setTransactionType = vi.fn();
      const setAmountDigits = vi.fn();
      const setDisplayMonth = vi.fn();
      const setRemovedAttachment = vi.fn();
      const setFile = vi.fn();
      const setIsMoreDetailsOpen = vi.fn();
      const setPrevTypeParam = vi.fn();
      const resolveDefaultTransactionType = vi.fn().mockReturnValue("EXPENSE");
      const convertAmountToDigits = vi.fn().mockReturnValue("25000");

      renderHook(() =>
        useTransactionInitialization({
          existingTx: mockTx,
          prevTxId: null,
          setPrevTxId,
          setTransactionType,
          setAmountDigits,
          setDisplayMonth,
          setRemovedAttachment,
          setFile,
          setIsMoreDetailsOpen,
          typeParam: null,
          prevTypeParam: null,
          setPrevTypeParam,
          resolveDefaultTransactionType,
          convertAmountToDigits,
        }),
      );

      expect(setPrevTxId).toHaveBeenCalledWith("tx-123");
      expect(setTransactionType).toHaveBeenCalledWith("EXPENSE");
      expect(setAmountDigits).toHaveBeenCalledWith("25000");
      expect(setDisplayMonth).toHaveBeenCalledWith(
        new Date("2026-05-10T12:00:00.000Z"),
      );
      expect(setRemovedAttachment).toHaveBeenCalledWith(false);
    });

    it("resets state when switching from existingTx back to new transaction", () => {
      const setPrevTxId = vi.fn();
      const setTransactionType = vi.fn();
      const setAmountDigits = vi.fn();
      const setDisplayMonth = vi.fn();
      const setRemovedAttachment = vi.fn();
      const setFile = vi.fn();
      const setIsMoreDetailsOpen = vi.fn();
      const setPrevTypeParam = vi.fn();
      const resolveDefaultTransactionType = vi.fn().mockReturnValue("EXPENSE");
      const convertAmountToDigits = vi.fn().mockReturnValue("");

      renderHook(() =>
        useTransactionInitialization({
          existingTx: undefined,
          prevTxId: "tx-old",
          setPrevTxId,
          setTransactionType,
          setAmountDigits,
          setDisplayMonth,
          setRemovedAttachment,
          setFile,
          setIsMoreDetailsOpen,
          typeParam: "INCOME",
          prevTypeParam: "INCOME",
          setPrevTypeParam,
          resolveDefaultTransactionType,
          convertAmountToDigits,
        }),
      );

      expect(setPrevTxId).toHaveBeenCalledWith(null);
      expect(setAmountDigits).toHaveBeenCalledWith("");
      expect(setRemovedAttachment).toHaveBeenCalledWith(false);
      expect(setFile).toHaveBeenCalledWith(null);
      expect(resolveDefaultTransactionType).toHaveBeenCalledWith(
        undefined,
        "INCOME",
      );
      expect(setPrevTypeParam).toHaveBeenCalledWith("INCOME");
    });

    it("syncs transaction type when typeParam changes in new transaction mode", () => {
      const setPrevTxId = vi.fn();
      const setTransactionType = vi.fn();
      const setAmountDigits = vi.fn();
      const setDisplayMonth = vi.fn();
      const setRemovedAttachment = vi.fn();
      const setFile = vi.fn();
      const setIsMoreDetailsOpen = vi.fn();
      const setPrevTypeParam = vi.fn();
      const resolveDefaultTransactionType = vi.fn().mockReturnValue("INCOME");
      const convertAmountToDigits = vi.fn();

      renderHook(() =>
        useTransactionInitialization({
          existingTx: undefined,
          prevTxId: null,
          setPrevTxId,
          setTransactionType,
          setAmountDigits,
          setDisplayMonth,
          setRemovedAttachment,
          setFile,
          setIsMoreDetailsOpen,
          typeParam: "INCOME",
          prevTypeParam: null,
          setPrevTypeParam,
          resolveDefaultTransactionType,
          convertAmountToDigits,
        }),
      );

      expect(setPrevTypeParam).toHaveBeenCalledWith("INCOME");
      expect(setTransactionType).toHaveBeenCalledWith("INCOME");
    });

    it("does nothing when conditions are not met", () => {
      const setPrevTxId = vi.fn();
      const setTransactionType = vi.fn();
      const setAmountDigits = vi.fn();
      const setDisplayMonth = vi.fn();
      const setRemovedAttachment = vi.fn();
      const setFile = vi.fn();
      const setIsMoreDetailsOpen = vi.fn();
      const setPrevTypeParam = vi.fn();
      const resolveDefaultTransactionType = vi.fn();
      const convertAmountToDigits = vi.fn();

      renderHook(() =>
        useTransactionInitialization({
          existingTx: undefined,
          prevTxId: null,
          setPrevTxId,
          setTransactionType,
          setAmountDigits,
          setDisplayMonth,
          setRemovedAttachment,
          setFile,
          setIsMoreDetailsOpen,
          typeParam: null,
          prevTypeParam: null,
          setPrevTypeParam,
          resolveDefaultTransactionType,
          convertAmountToDigits,
        }),
      );

      expect(setPrevTxId).not.toHaveBeenCalled();
      expect(setTransactionType).not.toHaveBeenCalled();
      expect(setAmountDigits).not.toHaveBeenCalled();
    });
  });
});
