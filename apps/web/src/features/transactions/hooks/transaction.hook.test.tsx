import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor as rtlWaitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const waitFor = (callback: () => void | Promise<void>) =>
  rtlWaitFor(callback, { interval: 2 });
import {
  createTransactionApi,
  deleteTransactionApi,
  getAvailableDatesApi,
  getTransactionApi,
  getTransactionsApi,
  getTransactionYearsApi,
  updateTransactionApi,
} from "../services/transaction.service";
import {
  useAvailableDatesQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useInfiniteTransactionsQuery,
  useTransactionQuery,
  useTransactionsQuery,
  useTransactionYearsQuery,
  useUpdateTransactionMutation,
} from "./transaction.hook";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import {
  PaginatedTransactionResponse,
  TransactionResponse,
} from "@/shared/lib/types/transaction.type";

vi.mock("../services/transaction.service", () => ({
  createTransactionApi: vi.fn(),
  getTransactionsApi: vi.fn(),
  getTransactionYearsApi: vi.fn(),
  updateTransactionApi: vi.fn(),
  deleteTransactionApi: vi.fn(),
  getAvailableDatesApi: vi.fn(),
  getTransactionApi: vi.fn(),
}));

const mockCreateTransactionApi = vi.mocked(createTransactionApi);
const mockGetTransactionsApi = vi.mocked(getTransactionsApi);
const mockGetTransactionYearsApi = vi.mocked(getTransactionYearsApi);
const mockUpdateTransactionApi = vi.mocked(updateTransactionApi);
const mockDeleteTransactionApi = vi.mocked(deleteTransactionApi);
const mockGetAvailableDatesApi = vi.mocked(getAvailableDatesApi);
const mockGetTransactionApi = vi.mocked(getTransactionApi);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, wrapper };
};

const mockTransaction: TransactionResponse = {
  id: "tx-1",
  type: "EXPENSE",
  amount: 100,
  note: "Lunch",
  transactionDate: "2026-07-08T00:00:00.000Z",
  assetId: "asset-1",
  categoryId: "cat-1",
  toAssetId: undefined,
  attachmentUrl: null,
  createdAt: "2026-07-08T00:00:00.000Z",
  updatedAt: "2026-07-08T00:00:00.000Z",
  deletedAt: null,
};

const mockPaginatedResponse: PaginatedTransactionResponse = {
  items: [mockTransaction],
  meta: {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 2,
    nextCursor: "cursor-next",
    previousCursor: "cursor-prev",
  },
};

describe("transaction.hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGuestStore.setState({ isGuest: false });
  });

  describe("useCreateTransactionMutation", () => {
    it("creates transaction, invalidates caches, and invokes onSuccess callback", async () => {
      mockCreateTransactionApi.mockResolvedValueOnce(mockTransaction);
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useCreateTransactionMutation({ onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.mutateAsync({
          type: "EXPENSE",
          data: {
            amount: 100,
            note: "Lunch",
            transactionDate: "2026-07-08T00:00:00.000Z",
            assetId: "asset-1",
            categoryId: "cat-1",
          },
        });
      });

      expect(mockCreateTransactionApi).toHaveBeenCalledWith(
        expect.objectContaining({ amount: 100 }),
        "EXPENSE",
      );
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["transactions"],
        refetchType: "all",
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["transaction"],
        refetchType: "all",
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["summary"] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["analytics"] });
      expect(onSuccess).toHaveBeenCalledWith(
        mockTransaction,
        expect.objectContaining({ type: "EXPENSE" }),
      );
    });
  });

  describe("useUpdateTransactionMutation", () => {
    it("updates transaction, patches query cache (items and pages), and invalidates queries", async () => {
      const updatedTx: TransactionResponse = {
        ...mockTransaction,
        note: "Updated lunch",
        amount: 150,
      };
      mockUpdateTransactionApi.mockResolvedValueOnce(updatedTx);
      const { queryClient, wrapper } = createWrapper();

      // Seed single transaction cache: one with existing object, one with null
      queryClient.setQueryData(["transaction", "tx-1"], { ...mockTransaction });
      queryClient.setQueryData(["transaction", "tx-1", "null-cache"], null);

      // Seed list caches: items array, pages array, non-object, and empty object
      queryClient.setQueryData(["transactions", "list"], {
        items: [
          { ...mockTransaction },
          { ...mockTransaction, id: "tx-2", note: "Other" },
        ],
      });
      queryClient.setQueryData(["transactions", "infinite"], {
        pages: [{ items: [{ ...mockTransaction }] }],
      });
      queryClient.setQueryData(["transactions", "primitive"], "string-cached");
      queryClient.setQueryData(["transactions", "empty-obj"], { foo: "bar" });

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useUpdateTransactionMutation({ onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.mutateAsync({
          id: "tx-1",
          data: {
            type: "EXPENSE",
            amount: 150,
            note: "Updated lunch",
            transactionDate: "2026-07-08T00:00:00.000Z",
            assetId: "asset-1",
          },
        });
      });

      expect(mockUpdateTransactionApi).toHaveBeenCalledWith(
        "tx-1",
        expect.objectContaining({ amount: 150 }),
      );

      // Verify single cache patched
      const cachedTx = queryClient.getQueryData<TransactionResponse>([
        "transaction",
        "tx-1",
      ]);
      expect(cachedTx?.note).toBe("Updated lunch");
      expect(cachedTx?.amount).toBe(150);

      // Verify list cache patched
      const cachedList = queryClient.getQueryData<{
        items: TransactionResponse[];
      }>(["transactions", "list"]);
      expect(cachedList?.items[0].note).toBe("Updated lunch");
      expect(cachedList?.items[1].note).toBe("Other");

      // Verify infinite pages cache patched
      const cachedPages = queryClient.getQueryData<{
        pages: Array<{ items: TransactionResponse[] }>;
      }>(["transactions", "infinite"]);
      expect(cachedPages?.pages[0].items[0].note).toBe("Updated lunch");

      // Verify primitive & other caches preserved
      expect(queryClient.getQueryData(["transactions", "primitive"])).toBe(
        "string-cached",
      );
      expect(queryClient.getQueryData(["transactions", "empty-obj"])).toEqual({
        foo: "bar",
      });

      expect(invalidateSpy).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(updatedTx);
    });
  });

  describe("useDeleteTransactionMutation", () => {
    it("deletes transaction, invalidates caches, and calls onSuccess", async () => {
      mockDeleteTransactionApi.mockResolvedValueOnce(undefined);
      const { queryClient, wrapper } = createWrapper();
      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useDeleteTransactionMutation({ onSuccess }),
        { wrapper },
      );

      await act(async () => {
        await result.current.mutateAsync({ id: "tx-1", isHardDelete: true });
      });

      expect(mockDeleteTransactionApi).toHaveBeenCalledWith("tx-1", true);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["assets"] });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe("useTransactionsQuery", () => {
    it("fetches paginated transactions with provided params", async () => {
      mockGetTransactionsApi.mockResolvedValueOnce(mockPaginatedResponse);
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () =>
          useTransactionsQuery(
            { page: 1, limit: 10 },
            {
              placeholderData: (prev) => prev,
            },
          ),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockPaginatedResponse);
      expect(mockGetTransactionsApi).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe("useInfiniteTransactionsQuery", () => {
    it("handles offset pagination fetching and next/previous page params", async () => {
      mockGetTransactionsApi.mockResolvedValue(mockPaginatedResponse);
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () =>
          useInfiniteTransactionsQuery(
            { limit: 10 },
            { initialData: mockPaginatedResponse },
          ),
        { wrapper },
      );

      expect(result.current.data?.pages[0]).toEqual(mockPaginatedResponse);
      await waitFor(() => expect(result.current.hasNextPage).toBe(true));

      // Test last page (page == totalPages) returns undefined for next page
      const lastPageResponse: PaginatedTransactionResponse = {
        ...mockPaginatedResponse,
        meta: { ...mockPaginatedResponse.meta, page: 2, totalPages: 2 },
      };
      const { wrapper: lastWrapper } = createWrapper();
      const { result: lastResult } = renderHook(
        () =>
          useInfiniteTransactionsQuery(
            { limit: 10 },
            { initialData: lastPageResponse },
          ),
        { wrapper: lastWrapper },
      );
      expect(lastResult.current.hasNextPage).toBe(false);
      expect(lastResult.current.hasPreviousPage).toBe(true);
    });

    it("handles cursor pagination queryFn and next/previous cursor params", async () => {
      mockGetTransactionsApi.mockResolvedValue(mockPaginatedResponse);
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () =>
          useInfiniteTransactionsQuery({
            pagination: "cursor",
          }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetTransactionsApi).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: "cursor",
          cursorDirection: "next",
        }),
        expect.anything(),
      );
      expect(result.current.hasNextPage).toBe(true);

      // Fetch next page with cursor
      await act(async () => {
        await result.current.fetchNextPage();
      });
      expect(mockGetTransactionsApi).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: "cursor",
          cursor: "cursor-next",
          cursorDirection: "next",
        }),
        expect.anything(),
      );

      // Test cursor pagination when no next or previous cursor
      const noCursorResponse: PaginatedTransactionResponse = {
        ...mockPaginatedResponse,
        meta: {
          ...mockPaginatedResponse.meta,
          nextCursor: undefined,
          previousCursor: undefined,
        },
      };
      const { wrapper: noCursorWrapper } = createWrapper();
      const { result: noCursorResult } = renderHook(
        () =>
          useInfiniteTransactionsQuery(
            {
              pagination: "cursor",
            },
            { initialData: noCursorResponse },
          ),
        { wrapper: noCursorWrapper },
      );
      expect(noCursorResult.current.hasNextPage).toBe(false);
      expect(noCursorResult.current.hasPreviousPage).toBe(false);
    });

    it("supports guest mode with default limit: 20", async () => {
      useGuestStore.setState({ isGuest: true });
      mockGetTransactionsApi.mockResolvedValue(mockPaginatedResponse);
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () =>
          useInfiniteTransactionsQuery(
            { searchKeyword: "Coffee" },
            { initialData: mockPaginatedResponse, maxPages: 2, gcTime: 5000 },
          ),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetTransactionsApi).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          searchKeyword: "Coffee",
        }),
        expect.anything(),
      );

      // maxPages without explicit gcTime defaults gcTime to 0
      const { wrapper: maxPagesWrapper } = createWrapper();
      renderHook(
        () =>
          useInfiniteTransactionsQuery(
            { searchKeyword: "Tea" },
            { maxPages: 3 },
          ),
        { wrapper: maxPagesWrapper },
      );
    });
  });

  describe("useTransactionYearsQuery", () => {
    it("fetches available transaction years", async () => {
      mockGetTransactionYearsApi.mockResolvedValueOnce([2026, 2025]);
      const { wrapper } = createWrapper();

      const { result } = renderHook(() => useTransactionYearsQuery(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([2026, 2025]);
    });
  });

  describe("useAvailableDatesQuery", () => {
    it("fetches available dates when assetId is provided without initialData", async () => {
      const dates = { "2026-07": ["2026-07-08"] };
      mockGetAvailableDatesApi.mockResolvedValueOnce(dates);
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () => useAvailableDatesQuery("asset-1", false),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(dates);
      expect(mockGetAvailableDatesApi).toHaveBeenCalledWith("asset-1", false);
    });

    it("uses initialData when provided and isGuest is false", () => {
      const dates = { "2026-07": ["2026-07-08"] };
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () =>
          useAvailableDatesQuery("asset-1", false, {
            initialData: dates,
          }),
        { wrapper },
      );

      expect(result.current.data).toEqual(dates);
      expect(mockGetAvailableDatesApi).not.toHaveBeenCalled();
    });

    it("fetches fresh data in guest mode even when initialData is provided", async () => {
      useGuestStore.setState({ isGuest: true });
      const dates = { "2026-07": ["2026-07-08"] };
      mockGetAvailableDatesApi.mockResolvedValueOnce(dates);
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () =>
          useAvailableDatesQuery("asset-1", false, {
            initialData: dates,
          }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetAvailableDatesApi).toHaveBeenCalled();
    });

    it("disables query when assetId is not provided", () => {
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useAvailableDatesQuery(), {
        wrapper,
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(mockGetAvailableDatesApi).not.toHaveBeenCalled();
    });
  });

  describe("useTransactionQuery", () => {
    it("fetches single transaction by id without initialData", async () => {
      mockGetTransactionApi.mockResolvedValueOnce(mockTransaction);
      const { wrapper } = createWrapper();

      const { result } = renderHook(() => useTransactionQuery("tx-1"), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockTransaction);
      expect(mockGetTransactionApi).toHaveBeenCalledWith("tx-1");
    });

    it("uses initialData when provided and isGuest is false", () => {
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () =>
          useTransactionQuery("tx-1", {
            initialData: mockTransaction,
          }),
        { wrapper },
      );

      expect(result.current.data).toEqual(mockTransaction);
      expect(mockGetTransactionApi).not.toHaveBeenCalled();
    });

    it("fetches fresh data in guest mode even when initialData is provided", async () => {
      useGuestStore.setState({ isGuest: true });
      mockGetTransactionApi.mockResolvedValueOnce(mockTransaction);
      const { wrapper } = createWrapper();

      const { result } = renderHook(
        () =>
          useTransactionQuery("tx-1", {
            initialData: mockTransaction,
          }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockGetTransactionApi).toHaveBeenCalled();
    });

    it("disables query when id is undefined", () => {
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useTransactionQuery(undefined), {
        wrapper,
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(mockGetTransactionApi).not.toHaveBeenCalled();
    });
  });
});
