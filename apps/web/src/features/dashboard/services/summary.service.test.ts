import { describe, expect, it, vi, beforeEach } from "vitest";
import { getTodaySummaryApi, getThisMonthSummaryApi } from "./summary.service";
import type {
  LocalAsset,
  LocalTransaction,
} from "@/shared/lib/storages/dexie.storage";
import { AssetType } from "@/shared/lib/types/asset.type";

let mockAssets: LocalAsset[] = [];
let mockTransactions: LocalTransaction[] = [];

vi.mock("@/shared/lib/storages/guest.storage", () => ({
  useGuestStore: {
    getState: () => ({ isGuest: true }),
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
      assets: {
        filter: (predicate: (a: LocalAsset) => boolean) => ({
          toArray: vi.fn(async () => mockAssets.filter(predicate)),
        }),
      },
      transactions: {
        where: () => ({
          between: () => ({
            filter: (predicate: (t: LocalTransaction) => boolean) => ({
              toArray: vi.fn(async () => mockTransactions.filter(predicate)),
            }),
          }),
        }),
      },
    },
  };
});

describe("summary.service in Guest Mode", () => {
  beforeEach(() => {
    mockTransactions = [];
    mockAssets = [
      {
        id: "asset-1",
        name: "Main Bank",
        type: AssetType.BANK,
        balance: 50000,
        displayOrder: 1,
        isArchived: false,
        includeInSnapshot: true,
        savingsAmount: 20000,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      {
        id: "asset-2",
        name: "Shortfall Account",
        type: AssetType.CASH,
        balance: 10000,
        displayOrder: 2,
        isArchived: false,
        includeInSnapshot: true,
        savingsAmount: 25000, // exceeds balance, clamped to 10000
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      {
        id: "asset-3",
        name: "Fully Excluded Account",
        type: AssetType.INVESTMENT,
        balance: 40000,
        displayOrder: 3,
        isArchived: false,
        includeInSnapshot: false,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ];
  });

  it("calculates totalNetWorth and excludedNetWorth with partial savings splits for today", async () => {
    const summary = await getTodaySummaryApi();

    // Spendable: Asset 1 (30,000) + Asset 2 (0) + Asset 3 (0) = 30,000
    expect(summary.totalNetWorth).toBe(30000);

    // Excluded: Asset 1 (20,000) + Asset 2 (10,000) + Asset 3 (40,000) = 70,000
    expect(summary.excludedNetWorth).toBe(70000);

    // Sum equals total asset balance
    expect(summary.totalNetWorth + (summary.excludedNetWorth || 0)).toBe(
      100000,
    );
  });

  it("calculates totalNetWorth and excludedNetWorth with partial savings splits for this month", async () => {
    const summary = await getThisMonthSummaryApi();

    expect(summary.totalNetWorth).toBe(30000);
    expect(summary.excludedNetWorth).toBe(70000);
    expect(summary.totalNetWorth + (summary.excludedNetWorth || 0)).toBe(
      100000,
    );
  });
});
