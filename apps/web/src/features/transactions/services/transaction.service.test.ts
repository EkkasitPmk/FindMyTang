import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "@/shared/lib/api/http";
import {
  CategoryType,
  type LocalAsset,
  type LocalCategory,
  type LocalTransaction,
} from "@/shared/lib/storages/dexie.storage";
import { AssetType } from "@/shared/lib/types/asset.type";
import {
  createTransactionApi,
  deleteTransactionApi,
  getAvailableDatesApi,
  getTransactionApi,
  getTransactionsApi,
  getTransactionYearsApi,
  updateTransactionApi,
} from "./transaction.service";

let isGuestMode = false;
let mockTransactions: LocalTransaction[] = [];
let mockCategories: LocalCategory[] = [];
let mockAssets: LocalAsset[] = [];

vi.mock("@/shared/lib/api/http", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
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
      transactions: {
        add: vi.fn(async (t: LocalTransaction) => {
          mockTransactions.push(t);
        }),
        get: vi.fn(async (id: string) =>
          mockTransactions.find((t) => t.id === id),
        ),
        put: vi.fn(async (t: LocalTransaction) => {
          const index = mockTransactions.findIndex((item) => item.id === t.id);
          if (index !== -1) mockTransactions[index] = t;
          else mockTransactions.push(t);
        }),
        delete: vi.fn(async (id: string) => {
          mockTransactions = mockTransactions.filter((t) => t.id !== id);
        }),
        toArray: vi.fn(async () => [...mockTransactions]),
        filter: vi.fn((predicate: (t: LocalTransaction) => boolean) => ({
          toArray: vi.fn(async () => mockTransactions.filter(predicate)),
        })),
      },
      categories: {
        get: vi.fn(async (id: string) =>
          mockCategories.find((c) => c.id === id),
        ),
        toArray: vi.fn(async () => [...mockCategories]),
      },
      assets: {
        get: vi.fn(async (id: string) => mockAssets.find((a) => a.id === id)),
        put: vi.fn(async (asset: LocalAsset) => {
          const index = mockAssets.findIndex((a) => a.id === asset.id);
          if (index !== -1) mockAssets[index] = asset;
          else mockAssets.push(asset);
        }),
        toArray: vi.fn(async () => [...mockAssets]),
      },
    },
  };
});

const mockHttpPost = vi.mocked(http.post);
const mockHttpGet = vi.mocked(http.get);
const mockHttpPatch = vi.mocked(http.patch);
const mockHttpDelete = vi.mocked(http.delete);

describe("transaction.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isGuestMode = false;
    mockTransactions = [];
    mockCategories = [
      {
        id: "cat-1",
        name: "Food",
        type: CategoryType.EXPENSE,
        color: "#EF4444",
        icon: "food-icon",
        displayOrder: 0,
        isSystem: false,
        syncStatus: "synced",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "cat-no-icon",
        name: "Miscellaneous",
        type: CategoryType.EXPENSE,
        color: null,
        icon: null,
        displayOrder: 1,
        isSystem: false,
        syncStatus: "synced",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    mockAssets = [
      {
        id: "asset-1",
        name: "Cash",
        type: AssetType.CASH,
        balance: 1000,
        displayOrder: 0,
        isArchived: false,
        syncStatus: "synced",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "asset-2",
        name: "Bank",
        type: AssetType.BANK,
        balance: 5000,
        displayOrder: 1,
        isArchived: false,
        syncStatus: "synced",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
  });

  describe("cloud mode (isGuest: false)", () => {
    it("createTransactionApi sends JSON when no file is attached", async () => {
      const responseData = {
        id: "tx-1",
        type: "EXPENSE",
        amount: 250,
        transactionDate: "2026-07-08T00:00:00.000Z",
        assetId: "asset-1",
        categoryId: "cat-1",
        note: "Dinner",
      };
      mockHttpPost.mockResolvedValueOnce({ data: responseData });

      const result = await createTransactionApi(
        {
          amount: 250,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          categoryId: "cat-1",
          note: "Dinner",
          toAssetId: "EXTERNAL",
        },
        "EXPENSE",
      );

      expect(result.id).toBe("tx-1");
      expect(mockHttpPost).toHaveBeenCalledWith(
        "/transactions",
        expect.objectContaining({
          type: "EXPENSE",
          amount: 250,
          assetId: "asset-1",
          categoryId: "cat-1",
          note: "Dinner",
        }),
      );
    });

    it("createTransactionApi sends FormData when file is attached and toAssetId is valid", async () => {
      const mockFile = new File(["dummy"], "receipt.png", {
        type: "image/png",
      });
      const responseData = {
        id: "tx-2",
        type: "TRANSFER",
        amount: 500,
        transactionDate: "2026-07-08T00:00:00.000Z",
        assetId: "asset-1",
        toAssetId: "asset-2",
      };
      mockHttpPost.mockResolvedValueOnce({ data: responseData });

      const result = await createTransactionApi(
        {
          amount: 500,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: "asset-2",
          file: mockFile,
        },
        "TRANSFER",
      );

      expect(result.id).toBe("tx-2");
      expect(mockHttpPost).toHaveBeenCalledWith(
        "/transactions",
        expect.any(FormData),
      );
    });

    it("getTransactionsApi fetches transactions via http.get", async () => {
      const paginatedData = {
        items: [
          {
            id: "tx-1",
            type: "EXPENSE",
            amount: 100,
            transactionDate: "2026-07-08T00:00:00.000Z",
            assetId: "asset-1",
          },
        ],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockHttpGet.mockResolvedValueOnce({ data: paginatedData });

      const result = await getTransactionsApi({ page: 1 });
      expect(result.items).toHaveLength(1);
      expect(mockHttpGet).toHaveBeenCalledWith("/transactions", {
        params: { page: 1 },
        signal: undefined,
      });
    });

    it("getAvailableDatesApi fetches dates via http.get", async () => {
      const dates = { "2026": ["July"] };
      mockHttpGet.mockResolvedValueOnce({ data: dates });

      const result = await getAvailableDatesApi("asset-1", false);
      expect(result).toEqual(dates);
      expect(mockHttpGet).toHaveBeenCalledWith(
        "/transactions/available-dates",
        {
          params: { assetId: "asset-1", isDeleted: false },
        },
      );
    });

    it("getTransactionApi fetches single transaction by id", async () => {
      const tx = { id: "tx-1", amount: 100 };
      mockHttpGet.mockResolvedValueOnce({ data: tx });

      const result = await getTransactionApi("tx-1");
      expect(result).toEqual(tx);
      expect(mockHttpGet).toHaveBeenCalledWith("/transactions/tx-1");
    });

    it("getTransactionYearsApi fetches years array", async () => {
      mockHttpGet.mockResolvedValueOnce({ data: [2026, 2025] });

      const result = await getTransactionYearsApi();
      expect(result).toEqual([2026, 2025]);
      expect(mockHttpGet).toHaveBeenCalledWith("/transactions/years");
    });

    it("updateTransactionApi sends JSON with mapped fields", async () => {
      const responseData = {
        id: "tx-1",
        type: "INCOME",
        amount: 300,
        transactionDate: "2026-07-08T00:00:00.000Z",
        assetId: "asset-1",
      };
      mockHttpPatch.mockResolvedValueOnce({ data: responseData });

      const result = await updateTransactionApi("tx-1", {
        type: "INCOME",
        amount: 300,
        assetId: "asset-1",
        transactionDate: "2026-07-08T00:00:00.000Z",
        note: "Bonus",
        toAssetId: "EXTERNAL",
        categoryId: "cat-1",
        attachmentUrl: null,
        deletedAt: null,
      });

      expect(result.id).toBe("tx-1");
      expect(mockHttpPatch).toHaveBeenCalledWith("/transactions/tx-1", {
        type: "INCOME",
        assetId: "asset-1",
        amount: 300,
        date: "2026-07-08T00:00:00.000Z",
        note: "Bonus",
        toAssetId: "",
        categoryId: "cat-1",
        attachmentUrl: "",
        deletedAt: "null",
      });
    });

    it("updateTransactionApi sends JSON with string deletedAt when no file", async () => {
      mockHttpPatch.mockResolvedValue({
        data: {
          id: "tx-1",
          type: "EXPENSE",
          amount: 100,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
        },
      });

      await updateTransactionApi("tx-1", {
        type: "EXPENSE",
        assetId: "asset-1",
        amount: 100,
        transactionDate: "2026-07-08T00:00:00.000Z",
        deletedAt: "2026-07-08T00:00:00.000Z",
        toAssetId: "asset-2",
      });

      expect(mockHttpPatch).toHaveBeenCalledWith("/transactions/tx-1", {
        type: "EXPENSE",
        assetId: "asset-1",
        amount: 100,
        date: "2026-07-08T00:00:00.000Z",
        toAssetId: "asset-2",
        deletedAt: "2026-07-08T00:00:00.000Z",
      });

      // deletedAt as empty string is ignored
      await updateTransactionApi("tx-1", {
        type: "EXPENSE",
        assetId: "asset-1",
        amount: 100,
        transactionDate: "2026-07-08T00:00:00.000Z",
        deletedAt: "",
      });
    });

    it("updateTransactionApi sends FormData when file is attached and deletedAt is a string", async () => {
      const mockFile = new File(["dummy"], "receipt.png", {
        type: "image/png",
      });
      const responseData = {
        id: "tx-1",
        type: "EXPENSE",
        amount: 100,
        transactionDate: "2026-07-08T00:00:00.000Z",
        assetId: "asset-1",
      };
      mockHttpPatch.mockResolvedValueOnce({ data: responseData });

      const result = await updateTransactionApi("tx-1", {
        type: "EXPENSE",
        assetId: "asset-1",
        amount: 100,
        transactionDate: "2026-07-08T00:00:00.000Z",
        file: mockFile,
        deletedAt: "2026-07-08T00:00:00.000Z",
      });

      expect(result.id).toBe("tx-1");
      expect(mockHttpPatch).toHaveBeenCalledWith(
        "/transactions/tx-1",
        expect.any(FormData),
      );
    });

    it("deleteTransactionApi calls http.delete with hardDelete param", async () => {
      mockHttpDelete.mockResolvedValueOnce({});
      await deleteTransactionApi("tx-1", true);
      expect(mockHttpDelete).toHaveBeenCalledWith("/transactions/tx-1", {
        params: { hardDelete: true },
      });
    });
  });

  describe("guest mode (isGuest: true)", () => {
    beforeEach(() => {
      isGuestMode = true;
    });

    it("handles external transfer, zero delta, and missing assets in balances and mapping", async () => {
      // 1. External transfer (toAssetId is null in guest mode)
      const extTransfer = await createTransactionApi(
        {
          amount: 100,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: "EXTERNAL",
        },
        "TRANSFER",
      );
      expect(extTransfer.toAssetId).toBeNull();

      // 2. Zero amount transaction triggers delta === 0 early return
      await createTransactionApi(
        {
          amount: 0,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
        },
        "EXPENSE",
      );

      // 3. Transaction with unknown IDs tests missing category, asset, and toAsset lookups
      const unlinkedTx = await createTransactionApi(
        {
          amount: 50,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "unknown-asset-id",
          categoryId: "unknown-cat-id",
          toAssetId: "unknown-to-asset-id",
        },
        "TRANSFER",
      );
      expect(unlinkedTx.category).toBeUndefined();
      expect(unlinkedTx.asset).toBeUndefined();
      expect(unlinkedTx.toAsset).toBeUndefined();

      // Category without color or icon, and empty assetId in single transaction mapper
      const noIconTx = await createTransactionApi(
        {
          amount: 25,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "",
          categoryId: "cat-no-icon",
        },
        "EXPENSE",
      );
      expect(noIconTx.category?.color).toBeUndefined();
      expect(noIconTx.category?.icon).toBeUndefined();
      expect(noIconTx.asset).toBeUndefined();

      // Unknown transaction type skips balance modification
      await createTransactionApi(
        {
          amount: 10,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
        },
        "UNKNOWN" as unknown as Parameters<typeof createTransactionApi>[1],
      );
    });

    it("creates guest transactions and updates asset balances appropriately", async () => {
      // 1. EXPENSE creates tx and decrements asset balance
      const expense = await createTransactionApi(
        {
          amount: 200,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          categoryId: "cat-1",
        },
        "EXPENSE",
      );
      expect(expense.category?.name).toBe("Food");
      expect(expense.asset?.name).toBe("Cash");
      expect(mockAssets[0].balance).toBe(800);

      // 2. INCOME creates tx and increments asset balance
      await createTransactionApi(
        {
          amount: 500,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
        },
        "INCOME",
      );
      expect(mockAssets[0].balance).toBe(1300);

      // 3. TRANSFER decrements asset1 and increments asset2
      const transfer = await createTransactionApi(
        {
          amount: 300,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          toAssetId: "asset-2",
        },
        "TRANSFER",
      );
      expect(transfer.toAsset?.name).toBe("Bank");
      expect(mockAssets[0].balance).toBe(1000);
      expect(mockAssets[1].balance).toBe(5300);

      // 4. ADJUSTMENT sets amount relative to target balance
      // target balance = 1500, current balance = 1000 => amount = 500
      await createTransactionApi(
        {
          amount: 1500,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
        },
        "ADJUSTMENT",
      );
      expect(mockAssets[0].balance).toBe(1500);

      // ADJUSTMENT with unknown asset keeps data.amount
      const unknownAdj = await createTransactionApi(
        {
          amount: 800,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "unknown-asset",
        },
        "ADJUSTMENT",
      );
      expect(unknownAdj.amount).toBe(800);
    });

    it("creates guest transaction with file attachment using fileToBase64", async () => {
      const mockFile = new File(["test-content"], "test.txt", {
        type: "text/plain",
      });
      const tx = await createTransactionApi(
        {
          amount: 50,
          transactionDate: "2026-07-08T00:00:00.000Z",
          assetId: "asset-1",
          file: mockFile,
        },
        "EXPENSE",
      );

      expect(tx.attachmentUrl).toBeDefined();

      // Test FileReader error handling
      vi.spyOn(FileReader.prototype, "readAsDataURL").mockImplementationOnce(
        function (this: FileReader) {
          setTimeout(
            () =>
              this.onerror?.(
                new ProgressEvent("error") as ProgressEvent<FileReader>,
              ),
            0,
          );
        },
      );
      await expect(
        createTransactionApi(
          {
            amount: 50,
            transactionDate: "2026-07-08T00:00:00.000Z",
            assetId: "asset-1",
            file: mockFile,
          },
          "EXPENSE",
        ),
      ).rejects.toThrow("Failed to read file as Base64");
    });

    it("getTransactionsApi filters by assetId, categoryId, type, date range, searchKeyword, and sortType", async () => {
      // Seed transactions including unknown category/asset IDs and empty date for fallbacks
      mockTransactions = [
        {
          id: "tx-1",
          amount: 100,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: "cat-1",
          toAssetId: null,
          note: "Supermarket groceries",
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-2",
          amount: 5000,
          date: "2026-07-10T00:00:00.000Z",
          type: "INCOME" as unknown as LocalTransaction["type"],
          assetId: "asset-2",
          categoryId: "cat-no-icon",
          toAssetId: null,
          note: "Salary",
          attachmentUrl: null,
          createdAt: "2026-07-10T00:00:00.000Z",
          updatedAt: "2026-07-10T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-3",
          amount: 200,
          date: "2026-07-15T00:00:00.000Z",
          type: "TRANSFER" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          toAssetId: "asset-2",
          categoryId: null,
          note: "Top up bank",
          attachmentUrl: null,
          createdAt: "2026-07-15T00:00:00.000Z",
          updatedAt: "2026-07-15T00:00:00.000Z",
          deletedAt: "2026-07-16T00:00:00.000Z",
          syncStatus: "synced",
        },
        {
          id: "tx-4",
          amount: 50,
          date: "",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "",
          categoryId: "unknown-cat",
          toAssetId: "unknown-to-asset",
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-15T00:00:00.000Z",
          updatedAt: "2026-07-15T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-missing-asset",
          amount: 25,
          date: "2026-07-20T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "deleted-asset-id",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
      ];

      // Default query: excludes deleted, uses default DATE_NEWEST sort with empty date fallback
      const defaultRes = await getTransactionsApi();
      expect(defaultRes.items).toHaveLength(4);

      // isDeleted: true includes all (both active and deleted)
      const deletedRes = await getTransactionsApi({ isDeleted: true });
      expect(deletedRes.items).toHaveLength(5);

      // assetId filter
      const assetRes = await getTransactionsApi({ assetId: "asset-2" });
      expect(assetRes.items).toHaveLength(1);

      // type filter
      const typeRes = await getTransactionsApi({ type: "INCOME" });
      expect(typeRes.items).toHaveLength(1);

      // categoryId filter
      const catRes = await getTransactionsApi({ categoryId: "cat-1" });
      expect(catRes.items).toHaveLength(1);

      // from & to date range
      const rangeRes = await getTransactionsApi({
        from: "2026-07-05T00:00:00.000Z",
        to: "2026-07-12T00:00:00.000Z",
      });
      expect(rangeRes.items).toHaveLength(1);

      // searchKeyword matching: note, category, asset, toAsset, type, amount
      const searchNote = await getTransactionsApi({
        searchKeyword: "Supermarket",
      });
      expect(searchNote.items).toHaveLength(1);

      const searchCategory = await getTransactionsApi({
        searchKeyword: "Food",
      });
      expect(searchCategory.items).toHaveLength(1);

      const searchAsset = await getTransactionsApi({ searchKeyword: "Cash" });
      expect(searchAsset.items).toHaveLength(1);

      const searchToAsset = await getTransactionsApi({
        searchKeyword: "Bank",
        isDeleted: true,
      });
      expect(searchToAsset.items).toHaveLength(2); // tx-2 asset and tx-3 toAsset

      const searchType = await getTransactionsApi({
        searchKeyword: "transfer",
        isDeleted: true,
      });
      expect(searchType.items).toHaveLength(1);

      const searchAmount = await getTransactionsApi({
        searchKeyword: "฿5,000.00",
      });
      expect(searchAmount.items).toHaveLength(1);

      // sortType tests
      const oldestRes = await getTransactionsApi({ sortType: "DATE_OLDEST" });
      expect(oldestRes.items).toBeDefined();

      const ascRes = await getTransactionsApi({ sortType: "asc" });
      expect(ascRes.items).toBeDefined();

      // Test sorting when empty dates appear in both positions (a and b)
      mockTransactions = [
        {
          id: "tx-empty-date",
          amount: 20,
          date: "",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-has-date",
          amount: 10,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
      ];
      await getTransactionsApi({ sortType: "DATE_OLDEST" });
      await getTransactionsApi({ sortType: "asc" });
      await getTransactionsApi(); // DATE_NEWEST fallback

      mockTransactions.reverse();
      await getTransactionsApi({ sortType: "DATE_OLDEST" });
      await getTransactionsApi({ sortType: "asc" });
      await getTransactionsApi(); // DATE_NEWEST fallback

      const highestRes = await getTransactionsApi({
        sortType: "AMOUNT_HIGHEST",
      });
      expect(highestRes.items[0].id).toBe("tx-empty-date");

      const lowestRes = await getTransactionsApi({ sortType: "AMOUNT_LOWEST" });
      expect(lowestRes.items[0].id).toBe("tx-has-date");
    });

    it("getAvailableDatesApi groups years and months correctly", async () => {
      mockTransactions = [
        {
          id: "tx-1",
          amount: 100,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-dup-month",
          amount: 50,
          date: "2026-07-15T00:00:00.000Z",
          type: "TRANSFER" as unknown as LocalTransaction["type"],
          assetId: "asset-2",
          toAssetId: "asset-1",
          categoryId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-15T00:00:00.000Z",
          updatedAt: "2026-07-15T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-2",
          amount: 100,
          date: "2025-12-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2025-12-01T00:00:00.000Z",
          updatedAt: "2025-12-01T00:00:00.000Z",
          deletedAt: "2025-12-02T00:00:00.000Z",
          syncStatus: "synced",
        },
      ];

      const activeDates = await getAvailableDatesApi("asset-1", false);
      expect(activeDates["2026"]).toContain("July");
      expect(activeDates["2026"]).toHaveLength(1); // deduplicated

      const allActiveDates = await getAvailableDatesApi();
      expect(allActiveDates["2026"]).toContain("July");

      const deletedDates = await getAvailableDatesApi("asset-1", true);
      expect(deletedDates["2025"]).toContain("December");
    });

    it("getTransactionApi returns mapped transaction or throws error if not found", async () => {
      mockTransactions = [
        {
          id: "tx-1",
          amount: 100,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: "cat-1",
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
      ];

      const tx = await getTransactionApi("tx-1");
      expect(tx.id).toBe("tx-1");

      await expect(getTransactionApi("unknown-tx")).rejects.toThrow(
        "Transaction not found",
      );
    });

    it("getTransactionYearsApi returns non-deleted years descending", async () => {
      mockTransactions = [
        {
          id: "tx-1",
          amount: 100,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-2",
          amount: 100,
          date: "2024-05-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2024-05-01T00:00:00.000Z",
          updatedAt: "2024-05-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-3",
          amount: 100,
          date: "2025-01-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
          deletedAt: "2025-01-02T00:00:00.000Z",
          syncStatus: "synced",
        },
      ];

      const years = await getTransactionYearsApi();
      expect(years).toEqual([2026, 2024]);
    });

    it("updateTransactionApi throws when transaction not found, or updates balances and data", async () => {
      await expect(
        updateTransactionApi("unknown-tx", {
          type: "EXPENSE",
          assetId: "asset-1",
          transactionDate: "2026-07-01T00:00:00.000Z",
          amount: 50,
        }),
      ).rejects.toThrow("Transaction not found");

      mockTransactions = [
        {
          id: "tx-1",
          amount: 200,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: "cat-1",
          toAssetId: null,
          note: "Old note",
          attachmentUrl: "http://old-url",
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
      ];
      // asset-1 balance starts at 1000
      mockAssets[0].balance = 1000;

      // Update amount to 500 (reverts 200 expense => +200, applies 500 expense => -500, balance becomes 700)
      const updated = await updateTransactionApi("tx-1", {
        type: "EXPENSE",
        assetId: "asset-1",
        transactionDate: "2026-07-01T00:00:00.000Z",
        amount: 500,
        note: "New note",
        toAssetId: "EXTERNAL",
        attachmentUrl: null,
      });

      expect(updated.amount).toBe(500);
      expect(updated.note).toBe("New note");
      expect(updated.toAssetId).toBeNull();
      expect(updated.attachmentUrl).toBeNull();
      expect(mockAssets[0].balance).toBe(700);

      // Update to ADJUSTMENT
      await updateTransactionApi("tx-1", {
        type: "ADJUSTMENT",
        assetId: "asset-1",
        transactionDate: "2026-07-01T00:00:00.000Z",
        amount: 1000,
        categoryId: null,
      });
      // asset balance becomes target amount (1000)
      expect(mockAssets[0].balance).toBe(1000);

      // Update to TRANSFER with valid toAssetId
      const transferUpdated = await updateTransactionApi("tx-1", {
        type: "TRANSFER",
        assetId: "asset-1",
        toAssetId: "asset-2",
        amount: 500,
        transactionDate: "2026-07-01T00:00:00.000Z",
      });
      expect(transferUpdated.toAssetId).toBe("asset-2");

      // Update with empty string toAssetId (converts to null)
      const emptyToAssetUpdated = await updateTransactionApi("tx-1", {
        type: "EXPENSE",
        assetId: "asset-1",
        toAssetId: "",
        amount: 100,
        transactionDate: "2026-07-01T00:00:00.000Z",
      });
      expect(emptyToAssetUpdated.toAssetId).toBeNull();

      // Update ADJUSTMENT with non-existent assetId (skips amount recalculation)
      await updateTransactionApi("tx-1", {
        type: "ADJUSTMENT",
        assetId: "unknown-asset",
        amount: 1000,
        transactionDate: "2026-07-01T00:00:00.000Z",
      });

      // Update with empty object falls back to existing fields
      const fallbackUpdated = await updateTransactionApi(
        "tx-1",
        {} as unknown as Parameters<typeof updateTransactionApi>[1],
      );
      expect(fallbackUpdated.type).toBe("ADJUSTMENT");
      expect(fallbackUpdated.assetId).toBe("unknown-asset");
      expect(fallbackUpdated.transactionDate).toBe("2026-07-01T00:00:00.000Z");
    });

    it("updateTransactionApi supports updating file attachment and soft deleting", async () => {
      mockTransactions = [
        {
          id: "tx-1",
          amount: 200,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
      ];
      mockAssets[0].balance = 800;

      const mockFile = new File(["test-update"], "update.txt", {
        type: "text/plain",
      });
      const updated = await updateTransactionApi("tx-1", {
        type: "EXPENSE",
        assetId: "asset-1",
        amount: 200,
        transactionDate: "2026-07-01T00:00:00.000Z",
        file: mockFile,
        deletedAt: "2026-07-08T00:00:00.000Z",
      });

      expect(updated.attachmentUrl).toBeDefined();
      expect(updated.deletedAt).toBe("2026-07-08T00:00:00.000Z");
      // soft-deleting reverted the 200 expense, balance becomes 1000
      expect(mockAssets[0].balance).toBe(1000);
    });

    it("deleteTransactionApi handles soft delete and hard delete in guest mode", async () => {
      mockTransactions = [
        {
          id: "tx-1",
          amount: 200,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
        {
          id: "tx-2",
          amount: 150,
          date: "2026-07-01T00:00:00.000Z",
          type: "EXPENSE" as unknown as LocalTransaction["type"],
          assetId: "asset-1",
          categoryId: null,
          toAssetId: null,
          note: null,
          attachmentUrl: null,
          createdAt: "2026-07-01T00:00:00.000Z",
          updatedAt: "2026-07-01T00:00:00.000Z",
          deletedAt: null,
          syncStatus: "synced",
        },
      ];
      mockAssets[0].balance = 650;

      // Soft delete tx-1
      await deleteTransactionApi("tx-1", false);
      expect(
        mockTransactions.find((t) => t.id === "tx-1")?.deletedAt,
      ).toBeDefined();
      expect(mockAssets[0].balance).toBe(850);

      // Hard delete tx-2
      await deleteTransactionApi("tx-2", true);
      expect(mockTransactions.find((t) => t.id === "tx-2")).toBeUndefined();
      expect(mockAssets[0].balance).toBe(1000);

      // Soft delete already deleted tx-1 does not revert again
      await deleteTransactionApi("tx-1", false);
      expect(mockAssets[0].balance).toBe(1000);

      // Hard delete already deleted tx-1 deletes without reverting
      await deleteTransactionApi("tx-1", true);
      expect(mockTransactions.find((t) => t.id === "tx-1")).toBeUndefined();
      expect(mockAssets[0].balance).toBe(1000);

      // Delete non-existing id does nothing (both soft and hard)
      await deleteTransactionApi("unknown-tx", false);
      await deleteTransactionApi("unknown-tx", true);
    });
  });
});
