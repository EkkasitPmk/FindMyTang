import { queryClient } from "@/shared/lib/api/queryClient";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  DEFAULT_GUEST_CATEGORIES,
  GUEST_AUTO_DELETE_AFTER_DAYS,
  GUEST_STORAGE_KEYS,
} from "../configs/guest.config";
import { db, type LocalCategory } from "./dexie.storage";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface GuestState {
  isGuest: boolean;
  setGuestMode: (isGuest: boolean) => void;
  clearGuestData: () => Promise<void>;
  runAutoDeleteTasks: () => Promise<void>;
  seedDefaultGuestData: () => Promise<void>;
}

let guestDataInitialization: Promise<void> | null = null;
let guestDataSeeding: Promise<void> | null = null;
let autoDeleteTask: Promise<void> | null = null;

const browserStorage = () =>
  typeof window === "undefined" ? null : window.localStorage;

const getInitialIsGuest = (): boolean => {
  try {
    const stored = browserStorage()?.getItem(GUEST_STORAGE_KEYS.state);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    return typeof (parsed as { state?: { isGuest?: unknown } })?.state
      ?.isGuest === "boolean"
      ? (parsed as { state: { isGuest: boolean } }).state.isGuest
      : true;
  } catch {
    return true;
  }
};

const createDefaultCategories = (now: string): LocalCategory[] =>
  DEFAULT_GUEST_CATEGORIES.map((category) => ({
    ...category,
    isSystem: true,
    syncStatus: "pending" as const,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }));

const seedDefaultGuestData = async (): Promise<void> => {
  const storage = browserStorage();
  if (storage?.getItem(GUEST_STORAGE_KEYS.seeded) === "true") return;

  const now = new Date().toISOString();
  await db.transaction("rw", db.categories, async () => {
    // The count check and insert share one transaction to avoid duplicate seeds.
    if ((await db.categories.count()) === 0) {
      await db.categories.bulkAdd(createDefaultCategories(now));
    }
  });
  storage?.setItem(GUEST_STORAGE_KEYS.seeded, "true");
  void queryClient.invalidateQueries({ queryKey: ["categories"] });
};

const runAutoDeleteTasks = async (): Promise<void> => {
  const storage = browserStorage();
  const today = new Date().toISOString().slice(0, 10);
  if (storage?.getItem(GUEST_STORAGE_KEYS.lastAutodelete) === today) return;

  const cutoff = new Date(
    Date.now() - GUEST_AUTO_DELETE_AFTER_DAYS * MS_PER_DAY,
  ).toISOString();
  const [assetIds, categoryIds, transactionIds] = await Promise.all([
    db.assets.where("deletedAt").belowOrEqual(cutoff).primaryKeys(),
    db.categories.where("deletedAt").belowOrEqual(cutoff).primaryKeys(),
    db.transactions.where("deletedAt").belowOrEqual(cutoff).primaryKeys(),
  ]);

  if (!assetIds.length && !categoryIds.length && !transactionIds.length) {
    storage?.setItem(GUEST_STORAGE_KEYS.lastAutodelete, today);
    return;
  }

  await db.transaction(
    "rw",
    [db.assets, db.categories, db.transactions],
    async () => {
      await Promise.all([
        db.assets.bulkDelete(assetIds),
        db.categories.bulkDelete(categoryIds),
        db.transactions.bulkDelete(transactionIds),
      ]);
    },
  );
  storage?.setItem(GUEST_STORAGE_KEYS.lastAutodelete, today);
};

export const useGuestStore = create<GuestState>()(
  persist(
    (set, get) => ({
      isGuest: getInitialIsGuest(),
      setGuestMode: (isGuest) => set({ isGuest }),

      clearGuestData: async () => {
        browserStorage()?.removeItem(GUEST_STORAGE_KEYS.seeded);
        browserStorage()?.removeItem(GUEST_STORAGE_KEYS.lastAutodelete);
        await db.transaction(
          "rw",
          [db.assets, db.categories, db.transactions],
          () =>
            Promise.all([
              db.assets.clear(),
              db.categories.clear(),
              db.transactions.clear(),
            ]).then(() => undefined),
        );
      },

      seedDefaultGuestData: async () => {
        if (!get().isGuest) return;
        guestDataSeeding ??= seedDefaultGuestData().finally(() => {
          guestDataSeeding = null;
        });
        await guestDataSeeding;
      },

      runAutoDeleteTasks: async () => {
        if (!get().isGuest) return;
        autoDeleteTask ??= runAutoDeleteTasks().finally(() => {
          autoDeleteTask = null;
        });
        await autoDeleteTask;
      },
    }),
    {
      name: GUEST_STORAGE_KEYS.state,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Run guest seed once without blocking layout or navigation. */
export function initializeGuestData(): Promise<void> {
  if (typeof window === "undefined" || !useGuestStore.getState().isGuest) {
    return Promise.resolve();
  }

  guestDataInitialization ??= useGuestStore
    .getState()
    .seedDefaultGuestData()
    .then(() => {
      const runCleanup = () => {
        void useGuestStore.getState().runAutoDeleteTasks().catch(console.error);
      };

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(runCleanup, { timeout: 5000 });
      } else {
        globalThis.setTimeout(runCleanup, 1000);
      }
    })
    .finally(() => {
      guestDataInitialization = null;
    });

  return guestDataInitialization ?? Promise.resolve();
}

export function useIsGuest() {
  return useGuestStore((state) => state.isGuest);
}

export async function getGuestDataCount() {
  const [assets, categories, transactions] = await Promise.all([
    db.assets.count(),
    db.categories.filter((category) => !category.isSystem).count(),
    db.transactions.count(),
  ]);
  return assets + categories + transactions;
}
