import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "@/shared/lib/api/http";
import {
  CategoryType,
  TransactionType,
  type LocalCategory,
  type LocalTransaction,
} from "@/shared/lib/storages/dexie.storage";
import {
  createCategoryApi,
  getCategoriesApi,
  updateCategory,
  restoreCategoryApi,
  deleteCategory,
  reorderCategoriesApi,
} from "./category.service";

let isGuestMode = false;
let mockCategories: LocalCategory[] = [];
let mockTransactions: LocalTransaction[] = [];
const mockSeedDefaultGuestData = vi.fn().mockResolvedValue(undefined);

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
    getState: () => ({
      isGuest: isGuestMode,
      seedDefaultGuestData: mockSeedDefaultGuestData,
    }),
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
      categories: {
        count: vi.fn(async () => mockCategories.length),
        add: vi.fn(async (cat: LocalCategory) => {
          mockCategories.push(cat);
        }),
        get: vi.fn(async (id: string) => {
          return mockCategories.find((c) => c.id === id);
        }),
        put: vi.fn(async (cat: LocalCategory) => {
          const index = mockCategories.findIndex((c) => c.id === cat.id);
          if (index !== -1) mockCategories[index] = cat;
          else mockCategories.push(cat);
        }),
        delete: vi.fn(async (id: string) => {
          mockCategories = mockCategories.filter((c) => c.id !== id);
        }),
        toCollection: vi.fn(() => ({
          sortBy: vi.fn(async () => [...mockCategories]),
        })),
        filter: vi.fn((predicate: (c: LocalCategory) => boolean) => ({
          sortBy: vi.fn(async () => mockCategories.filter(predicate)),
        })),
      },
      transactions: {
        filter: vi.fn((predicate: (t: LocalTransaction) => boolean) => ({
          toArray: vi.fn(async () => mockTransactions.filter(predicate)),
        })),
        put: vi.fn(async (tx: LocalTransaction) => {
          const index = mockTransactions.findIndex((t) => t.id === tx.id);
          if (index !== -1) mockTransactions[index] = tx;
          else mockTransactions.push(tx);
        }),
      },
      transaction: vi.fn(
        async (
          _mode: string,
          _table: unknown,
          callback: () => Promise<void>,
        ) => {
          await callback();
        },
      ),
    },
  };
});

describe("category.service", () => {
  const sampleCategory: LocalCategory = {
    id: "cat-1",
    name: "Groceries",
    type: CategoryType.EXPENSE,
    color: "#ff0000",
    icon: "shopping-cart",
    displayOrder: 1,
    isSystem: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    syncStatus: "synced",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    isGuestMode = false;
    mockCategories = [
      { ...sampleCategory },
      {
        id: "cat-2",
        name: "Salary",
        type: CategoryType.INCOME,
        displayOrder: 2,
        isSystem: true,
        createdAt: "2026-01-02T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        deletedAt: "2026-01-03T00:00:00.000Z",
        syncStatus: "synced",
      },
    ];
    mockTransactions = [
      {
        id: "tx-1",
        amount: 50,
        type: TransactionType.EXPENSE,
        assetId: "asset-1",
        categoryId: "cat-1",
        date: "2026-01-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ];
  });

  describe("Non-Guest (HTTP) Mode", () => {
    it("creates a category via http.post", async () => {
      vi.mocked(http.post).mockResolvedValueOnce({ data: sampleCategory });

      const result = await createCategoryApi({
        name: "Groceries",
        type: "EXPENSE",
        color: "#ff0000",
        icon: "shopping-cart",
      });

      expect(http.post).toHaveBeenCalledWith("/categories", {
        name: "Groceries",
        type: "EXPENSE",
        color: "#ff0000",
        icon: "shopping-cart",
      });
      expect(result.id).toBe("cat-1");
    });

    it("fetches categories with includeDeleted parameter", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [sampleCategory] });

      const resWithDeleted = await getCategoriesApi(true);
      expect(http.get).toHaveBeenCalledWith("/categories", {
        params: { includeDeleted: "true" },
      });
      expect(resWithDeleted).toHaveLength(1);

      const resWithoutDeleted = await getCategoriesApi(false);
      expect(http.get).toHaveBeenCalledWith("/categories", {
        params: { includeDeleted: "false" },
      });
      expect(resWithoutDeleted).toHaveLength(1);
    });

    it("updates a category via http.patch", async () => {
      const updatedCategory = { ...sampleCategory, name: "Supermarket" };
      vi.mocked(http.patch).mockResolvedValueOnce({ data: updatedCategory });

      const result = await updateCategory("cat-1", { name: "Supermarket" });
      expect(http.patch).toHaveBeenCalledWith("/categories/cat-1", {
        name: "Supermarket",
      });
      expect(result.name).toBe("Supermarket");
    });

    it("restores a category via http.patch", async () => {
      vi.mocked(http.patch).mockResolvedValueOnce({ data: sampleCategory });

      const result = await restoreCategoryApi("cat-1");
      expect(http.patch).toHaveBeenCalledWith("/categories/cat-1/restore");
      expect(result.id).toBe("cat-1");
    });

    it("deletes a category (soft and hard delete) via http.delete", async () => {
      vi.mocked(http.delete).mockResolvedValue({ data: sampleCategory });

      await deleteCategory("cat-1");
      expect(http.delete).toHaveBeenCalledWith("/categories/cat-1");

      await deleteCategory("cat-1", true);
      expect(http.delete).toHaveBeenCalledWith(
        "/categories/cat-1?isHardDelete=true",
      );
    });

    it("reorders categories via http.patch", async () => {
      vi.mocked(http.patch).mockResolvedValueOnce({ data: { success: true } });

      const result = await reorderCategoriesApi(["cat-2", "cat-1"]);
      expect(http.patch).toHaveBeenCalledWith("/categories/reorder", {
        ids: ["cat-2", "cat-1"],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Guest (Dexie) Mode", () => {
    beforeEach(() => {
      isGuestMode = true;
    });

    it("creates a category in Dexie with defaults", async () => {
      const result = await createCategoryApi({
        name: "Rent",
        type: "EXPENSE",
      });

      expect(result.name).toBe("Rent");
      expect(result.isSystem).toBe(false);
      expect(result.displayOrder).toBe(3);
    });

    it("fetches categories in guest mode after seeding default data", async () => {
      const allCategories = await getCategoriesApi(true);
      expect(mockSeedDefaultGuestData).toHaveBeenCalled();
      expect(allCategories).toHaveLength(2);

      const activeCategories = await getCategoriesApi(false);
      expect(activeCategories).toHaveLength(1);
      expect(activeCategories[0].id).toBe("cat-1");
    });

    it("updates existing category or throws if not found", async () => {
      const updatedWithName = await updateCategory("cat-1", {
        name: "Supermarket",
      });
      expect(updatedWithName.name).toBe("Supermarket");
      expect(updatedWithName.type).toBe("EXPENSE");

      const updatedWithType = await updateCategory("cat-1", {
        type: "INCOME",
      });
      expect(updatedWithType.type).toBe("INCOME");

      await expect(
        updateCategory("unknown-id", { name: "Fail" }),
      ).rejects.toThrow("Category not found");
    });

    it("restores existing category or throws if not found", async () => {
      const restored = await restoreCategoryApi("cat-2");
      expect(restored.deletedAt).toBeNull();

      await expect(restoreCategoryApi("unknown-id")).rejects.toThrow(
        "Category not found",
      );
    });

    it("soft deletes a category in guest mode", async () => {
      const softDeleted = await deleteCategory("cat-1", false);
      expect(softDeleted.deletedAt).toBeTruthy();
      expect(
        mockCategories.find((c) => c.id === "cat-1")?.deletedAt,
      ).toBeTruthy();

      await expect(deleteCategory("unknown-id")).rejects.toThrow(
        "Category not found",
      );
    });

    it("hard deletes a category and unlinks linked transactions in guest mode", async () => {
      const hardDeleted = await deleteCategory("cat-1", true);
      expect(hardDeleted.id).toBe("cat-1");
      expect(mockCategories.find((c) => c.id === "cat-1")).toBeUndefined();
      expect(
        mockTransactions.find((t) => t.id === "tx-1")?.categoryId,
      ).toBeNull();
    });

    it("reorders categories in guest mode and ignores unknown category ids", async () => {
      const result = await reorderCategoriesApi([
        "cat-2",
        "cat-unknown",
        "cat-1",
      ]);
      expect(result.success).toBe(true);

      const cat2 = mockCategories.find((c) => c.id === "cat-2");
      expect(cat2?.displayOrder).toBe(1);

      const cat1 = mockCategories.find((c) => c.id === "cat-1");
      expect(cat1?.displayOrder).toBe(3);
    });
  });
});
