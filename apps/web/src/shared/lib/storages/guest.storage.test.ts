import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LocalCategory } from "./dexie.storage";
import {
  GUEST_STORAGE_KEYS,
  DEFAULT_GUEST_CATEGORIES,
} from "../configs/guest.config";

let mockCategories: LocalCategory[] = [];

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
          sortBy: vi.fn(async (key: keyof LocalCategory) =>
            mockCategories
              .filter(predicate)
              .sort((a, b) => (a[key]! > b[key]! ? 1 : -1)),
          ),
        }),
        where: () => ({
          belowOrEqual: () => ({ primaryKeys: vi.fn(async () => []) }),
        }),
        bulkDelete: vi.fn(async () => {}),
      },
      assets: {
        clear: vi.fn(async () => {}),
        where: () => ({
          belowOrEqual: () => ({ primaryKeys: vi.fn(async () => []) }),
        }),
        bulkDelete: vi.fn(async () => {}),
      },
      transactions: {
        clear: vi.fn(async () => {}),
        where: () => ({
          belowOrEqual: () => ({ primaryKeys: vi.fn(async () => []) }),
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
import { useGuestStore, initializeGuestData } from "./guest.storage";
import { getCategoriesApi } from "@/features/category/services/category.service";

describe("Guest Storage Seeding", () => {
  beforeEach(async () => {
    localStorage.clear();
    mockCategories = [];
    await db.categories.clear();
    useGuestStore.getState().setGuestMode(true);
  });

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

  it("is idempotent and does not create duplicate categories on multiple seeds", async () => {
    await useGuestStore.getState().seedDefaultGuestData();
    const initialCount = await db.categories.count();

    await useGuestStore.getState().seedDefaultGuestData();
    const countAfterSecondSeed = await db.categories.count();

    expect(countAfterSecondSeed).toBe(initialCount);
  });

  it("re-seeds default categories if localStorage has stale seeded flag but Dexie is empty", async () => {
    // Simulate stale flag left from previous session
    localStorage.setItem(GUEST_STORAGE_KEYS.seeded, "true");
    expect(await db.categories.count()).toBe(0);

    await useGuestStore.getState().seedDefaultGuestData();

    // Must re-seed because Dexie count was 0
    expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);
  });

  it("initializeGuestData triggers seed in guest mode", async () => {
    expect(await db.categories.count()).toBe(0);

    await initializeGuestData();

    const count = await db.categories.count();
    expect(count).toBe(DEFAULT_GUEST_CATEGORIES.length);
  });

  it("getCategoriesApi seeds and returns default categories on demand for guest", async () => {
    expect(await db.categories.count()).toBe(0);

    const categories = await getCategoriesApi(true);

    expect(categories).toHaveLength(DEFAULT_GUEST_CATEGORIES.length);
    expect(await db.categories.count()).toBe(DEFAULT_GUEST_CATEGORIES.length);
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
