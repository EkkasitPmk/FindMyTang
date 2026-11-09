import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CategoryType, type LocalCategory } from "./dexie.storage";
import {
  GUEST_STORAGE_KEYS,
  DEFAULT_GUEST_CATEGORIES,
} from "../configs/guest.config";

let mockCategories: LocalCategory[] = [];
let deletedAssetKeys: string[] = [];
let deletedCategoryKeys: string[] = [];
let deletedTxKeys: string[] = [];
let deletedRecurKeys: string[] = [];
let mockAssetCount = 1;
let mockTxCount = 2;

vi.mock("./dexie.storage", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./dexie.storage")>();
  return {
    ...actual,
    db: {
      categories: {
        count: vi.fn(async () => mockCategories.length),
        bulkAdd: vi.fn(async (items: LocalCategory[]) => {
          mockCategories.push(...items);
        }),
        clear: vi.fn(async () => {
          mockCategories = [];
        }),
        toArray: vi.fn(async () => [...mockCategories]),
        toCollection: () => ({
          sortBy: vi.fn(async (key: keyof LocalCategory) =>
            [...mockCategories].sort((a, b) => (a[key]! > b[key]! ? 1 : -1)),
          ),
        }),
        filter: (predicate: (c: LocalCategory) => boolean) => ({
          count: vi.fn(async () => mockCategories.filter(predicate).length),
          sortBy: vi.fn(async (key: keyof LocalCategory) =>
            mockCategories
              .filter(predicate)
              .sort((a, b) => (a[key]! > b[key]! ? 1 : -1)),
          ),
        }),
        where: () => ({
          belowOrEqual: () => ({
            primaryKeys: vi.fn(async () => deletedCategoryKeys),
          }),
        }),
        bulkDelete: vi.fn(async () => {}),
      },
      assets: {
        count: vi.fn(async () => mockAssetCount),
        clear: vi.fn(async () => {}),
        where: () => ({
          belowOrEqual: () => ({
            primaryKeys: vi.fn(async () => deletedAssetKeys),
          }),
        }),
        bulkDelete: vi.fn(async () => {}),
      },
      transactions: {
        count: vi.fn(async () => mockTxCount),
        clear: vi.fn(async () => {}),
        where: () => ({
          belowOrEqual: () => ({
            primaryKeys: vi.fn(async () => deletedTxKeys),
          }),
        }),
        bulkDelete: vi.fn(async () => {}),
      },
      recurringExpenses: {
        count: vi.fn(async () => 0),
        clear: vi.fn(async () => {}),
        where: () => ({
          belowOrEqual: () => ({
            primaryKeys: vi.fn(async () => deletedRecurKeys),
          }),
        }),
        bulkDelete: vi.fn(async () => {}),
      },
      transaction: vi.fn(
        async (
          _mode: unknown,
          _tables: unknown,
          callback: () => Promise<void>,
        ) => {
          return callback();
        },
      ),
    },
  };
});

import { db } from "./dexie.storage";
import {
  useGuestStore,
  initializeGuestData,
  useIsGuest,
  getGuestDataCount,
} from "./guest.storage";
import { getCategoriesApi } from "@/features/category/services/category.service";

describe("Guest Storage", () => {
  beforeEach(async () => {
    localStorage.clear();
    mockCategories = [];
    deletedAssetKeys = [];
    deletedCategoryKeys = [];
    deletedTxKeys = [];
    deletedRecurKeys = [];
    mockAssetCount = 1;
    mockTxCount = 2;
    vi.clearAllMocks();
    await db.categories.clear();
    useGuestStore.getState().setGuestMode(true);
  });

  describe("seeding and initialization", () => {
    it("seeds default categories when seedDefaultGuestData is called", async () => {
      expect(await db.categories.count()).toBe(0);

      await useGuestStore.getState().seedDefaultGuestData();

      const count = await db.categories.count();
      expect(count).toBe(DEFAULT_GUEST_CATEGORIES.length);
      expect(localStorage.getItem(GUEST_STORAGE_KEYS.seeded)).toBe("true");

      const categories = await db.categories.toArray();
      const expenseNames = categories
        .filter((c) => c.type === "EXPENSE")
        .map((c) => c.name);
      expect(expenseNames).toContain("Food");
      expect(expenseNames).toContain("Snack");
    });

    it("does not seed when isGuest is false", async () => {
      useGuestStore.getState().setGuestMode(false);
      await useGuestStore.getState().seedDefaultGuestData();
      expect(await db.categories.count()).toBe(0);
    });

    it("is idempotent and does not create duplicate categories on multiple seeds", async () => {
      await useGuestStore.getState().seedDefaultGuestData();
      const initialCount = await db.categories.count();

      await useGuestStore.getState().seedDefaultGuestData();
      const countAfterSecondSeed = await db.categories.count();

      expect(countAfterSecondSeed).toBe(initialCount);
    });

    it("does not re-seed default categories if guest user intentionally deletes all categories in an active session", async () => {
      // 1. Initial seed for guest
      await useGuestStore.getState().seedDefaultGuestData();
      expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);
      expect(localStorage.getItem(GUEST_STORAGE_KEYS.seeded)).toBe("true");

      // 2. User intentionally deletes all categories (0 items left)
      await db.categories.clear();
      expect(await db.categories.count()).toBe(0);

      // 3. System tries to seed on page reload/navigation
      await useGuestStore.getState().seedDefaultGuestData();

      // 4. Must NOT re-seed, preserving the user's intentional deletion
      expect(await db.categories.count()).toBe(0);
    });

    it("initializeGuestData does nothing if not guest mode", async () => {
      useGuestStore.getState().setGuestMode(false);
      await initializeGuestData();
      expect(await db.categories.count()).toBe(0);
    });

    it("initializeGuestData triggers seed and schedules cleanup via requestIdleCallback", async () => {
      expect(await db.categories.count()).toBe(0);
      const idleMock = vi.fn((cb: () => void) => {
        cb();
        return 1;
      });
      window.requestIdleCallback =
        idleMock as unknown as typeof window.requestIdleCallback;

      await initializeGuestData();

      const count = await db.categories.count();
      expect(count).toBe(DEFAULT_GUEST_CATEGORIES.length);
      expect(idleMock).toHaveBeenCalled();
    });

    it("initializeGuestData falls back to setTimeout when requestIdleCallback is absent", async () => {
      vi.useFakeTimers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).requestIdleCallback;

      const promise = initializeGuestData();
      await vi.runAllTimersAsync();
      await promise;

      expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);
      vi.useRealTimers();
    });

    it("getCategoriesApi seeds and returns default categories on demand for guest", async () => {
      expect(await db.categories.count()).toBe(0);

      const categories = await getCategoriesApi(true);

      expect(categories).toHaveLength(DEFAULT_GUEST_CATEGORIES.length);
      expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);
    });

    it("handles concurrent seedDefaultGuestData and initializeGuestData calls gracefully", async () => {
      await Promise.all([
        useGuestStore.getState().seedDefaultGuestData(),
        useGuestStore.getState().seedDefaultGuestData(),
      ]);
      expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);

      await Promise.all([initializeGuestData(), initializeGuestData()]);
      expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);
    });

    it("does not insert default categories if categories count is already greater than 0 without seeded key", async () => {
      mockCategories = [
        {
          id: "custom-1",
          name: "Custom",
          type: CategoryType.EXPENSE,
          displayOrder: 0,
          isSystem: false,
          syncStatus: "synced",
          createdAt: "",
          updatedAt: "",
        },
      ];
      localStorage.removeItem(GUEST_STORAGE_KEYS.seeded);

      await useGuestStore.getState().seedDefaultGuestData();

      expect(mockCategories).toHaveLength(1);
      expect(localStorage.getItem(GUEST_STORAGE_KEYS.seeded)).toBe("true");
    });

    it("handles logout recovery flow by clearing and re-seeding guest categories", async () => {
      // 1. User was guest and seeded
      await useGuestStore.getState().seedDefaultGuestData();
      expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);

      // 2. User logged in (isGuest = false, guest data cleared)
      useGuestStore.getState().setGuestMode(false);
      await useGuestStore.getState().clearGuestData();
      expect(await db.categories.count()).toBe(0);

      // 3. User logs out (isGuest = true, seed triggered)
      useGuestStore.getState().setGuestMode(true);
      await useGuestStore.getState().seedDefaultGuestData();

      // 4. Categories are back
      expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);
    });
  });

  describe("runAutoDeleteTasks", () => {
    it("does nothing when not guest", async () => {
      useGuestStore.getState().setGuestMode(false);
      await useGuestStore.getState().runAutoDeleteTasks();
      expect(
        localStorage.getItem(GUEST_STORAGE_KEYS.lastAutodelete),
      ).toBeNull();
    });

    it("skips if already ran today", async () => {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(GUEST_STORAGE_KEYS.lastAutodelete, today);

      await useGuestStore.getState().runAutoDeleteTasks();
      expect(db.assets.bulkDelete).not.toHaveBeenCalled();
    });

    it("handles concurrent runAutoDeleteTasks calls safely", async () => {
      deletedAssetKeys = ["asset-concurrent"];
      await Promise.all([
        useGuestStore.getState().runAutoDeleteTasks(),
        useGuestStore.getState().runAutoDeleteTasks(),
      ]);
      expect(db.assets.bulkDelete).toHaveBeenCalledWith(["asset-concurrent"]);
    });

    it("records today timestamp when no expired records are found", async () => {
      deletedAssetKeys = [];
      deletedCategoryKeys = [];
      deletedTxKeys = [];
      deletedRecurKeys = [];

      await useGuestStore.getState().runAutoDeleteTasks();

      const today = new Date().toISOString().slice(0, 10);
      expect(localStorage.getItem(GUEST_STORAGE_KEYS.lastAutodelete)).toBe(
        today,
      );
      expect(db.assets.bulkDelete).not.toHaveBeenCalled();
    });

    it("deletes expired records and records timestamp when expired records exist", async () => {
      deletedAssetKeys = ["asset-old"];
      deletedCategoryKeys = ["cat-old"];
      deletedTxKeys = ["tx-old"];
      deletedRecurKeys = ["rec-old"];

      await useGuestStore.getState().runAutoDeleteTasks();

      const today = new Date().toISOString().slice(0, 10);
      expect(localStorage.getItem(GUEST_STORAGE_KEYS.lastAutodelete)).toBe(
        today,
      );
      expect(db.assets.bulkDelete).toHaveBeenCalledWith(["asset-old"]);
      expect(db.categories.bulkDelete).toHaveBeenCalledWith(["cat-old"]);
      expect(db.transactions.bulkDelete).toHaveBeenCalledWith(["tx-old"]);
      expect(db.recurringExpenses.bulkDelete).toHaveBeenCalledWith(["rec-old"]);
    });
  });

  describe("useIsGuest", () => {
    it("reflects the current guest mode state", () => {
      const { result } = renderHook(() => useIsGuest());
      expect(result.current).toBe(true);

      act(() => {
        useGuestStore.getState().setGuestMode(false);
      });
      expect(result.current).toBe(false);
    });
  });

  describe("getGuestDataCount", () => {
    it("sums assets, non-system categories, and transactions", async () => {
      mockAssetCount = 4;
      mockTxCount = 5;
      mockCategories = [
        {
          id: "sys-1",
          name: "System",
          type: CategoryType.EXPENSE,
          displayOrder: 0,
          isSystem: true,
          syncStatus: "synced",
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "user-1",
          name: "Custom",
          type: CategoryType.EXPENSE,
          displayOrder: 1,
          isSystem: false,
          syncStatus: "pending",
          createdAt: "",
          updatedAt: "",
        },
      ];

      const count = await getGuestDataCount();
      // assets: 4, non-system categories: 1, transactions: 5 -> total: 10
      expect(count).toBe(10);
    });
  });

  describe("initialization and storage fallbacks", () => {
    it("falls back to true when stored state JSON is corrupt or invalid", async () => {
      vi.resetModules();
      localStorage.setItem(GUEST_STORAGE_KEYS.state, "{invalid-json");
      const { useGuestStore: reloadedStore } = await import("./guest.storage");
      expect(reloadedStore.getState().isGuest).toBe(true);
    });

    it("loads isGuest from valid stored state in localStorage", async () => {
      vi.resetModules();
      localStorage.setItem(
        GUEST_STORAGE_KEYS.state,
        JSON.stringify({ state: { isGuest: false } }),
      );
      const { useGuestStore: reloadedStore } = await import("./guest.storage");
      expect(reloadedStore.getState().isGuest).toBe(false);
    });

    it("handles SSR environment when window is undefined", async () => {
      vi.resetModules();
      const originalWindow = globalThis.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).window;
      try {
        const { useGuestStore: ssrStore, initializeGuestData: ssrInit } =
          await import("./guest.storage");
        expect(ssrStore.getState().isGuest).toBe(true);
        await expect(ssrInit()).resolves.toBeUndefined();
      } finally {
        globalThis.window = originalWindow;
      }
    });
  });
});
