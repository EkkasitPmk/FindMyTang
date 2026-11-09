import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "@/shared/lib/api/http";
import { AssetType } from "@/shared/lib/types/asset.type";
import type { LocalAsset } from "@/shared/lib/storages/dexie.storage";
import { db } from "@/shared/lib/storages/dexie.storage";
import {
  createAssetApi,
  getAssetsApi,
  updateAssetApi,
  restoreAssetApi,
  deleteAssetApi,
  bulkDeleteAssetsApi,
  bulkArchiveAssetsApi,
  bulkRestoreAssetsApi,
  reorderAssetsApi,
} from "./assets.service";

let isGuestMode = false;
let mockLocalAssets: LocalAsset[] = [];

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

vi.mock("@/shared/lib/storages/dexie.storage", () => {
  return {
    db: {
      assets: {
        count: vi.fn(async () => mockLocalAssets.length),
        add: vi.fn(async (asset: LocalAsset) => {
          mockLocalAssets.push(asset);
        }),
        get: vi.fn(async (id: string) => {
          return mockLocalAssets.find((a) => a.id === id);
        }),
        put: vi.fn(async (asset: LocalAsset) => {
          const index = mockLocalAssets.findIndex((a) => a.id === asset.id);
          if (index !== -1) mockLocalAssets[index] = asset;
          else mockLocalAssets.push(asset);
        }),
        delete: vi.fn(async (id: string) => {
          mockLocalAssets = mockLocalAssets.filter((a) => a.id !== id);
        }),
        bulkDelete: vi.fn(async (ids: string[]) => {
          mockLocalAssets = mockLocalAssets.filter((a) => !ids.includes(a.id));
        }),
        bulkPut: vi.fn(async (assets: LocalAsset[]) => {
          for (const asset of assets) {
            const index = mockLocalAssets.findIndex((a) => a.id === asset.id);
            if (index !== -1) mockLocalAssets[index] = asset;
            else mockLocalAssets.push(asset);
          }
        }),
        orderBy: vi.fn(() => ({
          toArray: vi.fn(async () => [...mockLocalAssets]),
        })),
        where: vi.fn(() => ({
          anyOf: vi.fn((ids: string[]) => ({
            toArray: vi.fn(async () =>
              mockLocalAssets.filter((a) => ids.includes(a.id)),
            ),
          })),
        })),
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

describe("assets.service", () => {
  const sampleAsset: LocalAsset = {
    id: "asset-1",
    name: "Checking",
    type: AssetType.BANK,
    balance: 5000,
    color: "#123456",
    displayOrder: 1,
    isArchived: false,
    includeInSnapshot: true,
    savingsAmount: 1000,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
    syncStatus: "synced",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    isGuestMode = false;
    mockLocalAssets = [
      { ...sampleAsset },
      {
        id: "asset-2",
        name: "Cash",
        type: AssetType.CASH,
        balance: 200,
        displayOrder: 2,
        isArchived: false,
        includeInSnapshot: true,
        savingsAmount: 0,
        createdAt: "2026-01-02T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        deletedAt: "2026-01-03T00:00:00.000Z",
        syncStatus: "synced",
      },
    ];
  });

  describe("Non-Guest (HTTP) Mode", () => {
    it("creates an asset via http.post", async () => {
      vi.mocked(http.post).mockResolvedValueOnce({ data: sampleAsset });
      const result = await createAssetApi({
        name: "Checking",
        type: AssetType.BANK,
        balance: 5000,
      });

      expect(http.post).toHaveBeenCalledWith("/assets", {
        name: "Checking",
        type: AssetType.BANK,
        balance: 5000,
      });
      expect(result.id).toBe("asset-1");
    });

    it("fetches assets with or without includeDeleted query parameter", async () => {
      vi.mocked(http.get).mockResolvedValue({ data: [sampleAsset] });

      const withoutDeleted = await getAssetsApi();
      expect(http.get).toHaveBeenCalledWith("/assets");
      expect(withoutDeleted).toHaveLength(1);

      const withDeleted = await getAssetsApi(true);
      expect(http.get).toHaveBeenCalledWith("/assets?includeDeleted=true");
      expect(withDeleted).toHaveLength(1);
    });

    it("updates an asset via http.patch", async () => {
      const updatedAsset = { ...sampleAsset, name: "Checking Updated" };
      vi.mocked(http.patch).mockResolvedValueOnce({ data: updatedAsset });

      const result = await updateAssetApi("asset-1", {
        name: "Checking Updated",
      });
      expect(http.patch).toHaveBeenCalledWith("/assets/asset-1", {
        name: "Checking Updated",
      });
      expect(result.name).toBe("Checking Updated");
    });

    it("restores an asset via http.patch", async () => {
      vi.mocked(http.patch).mockResolvedValueOnce({ data: sampleAsset });

      const result = await restoreAssetApi("asset-1");
      expect(http.patch).toHaveBeenCalledWith("/assets/asset-1/restore");
      expect(result.id).toBe("asset-1");
    });

    it("deletes an asset (soft and hard delete) via http.delete", async () => {
      vi.mocked(http.delete).mockResolvedValue({ data: sampleAsset });

      await deleteAssetApi("asset-1");
      expect(http.delete).toHaveBeenCalledWith("/assets/asset-1");

      await deleteAssetApi("asset-1", true);
      expect(http.delete).toHaveBeenCalledWith("/assets/asset-1?hard=true");
    });

    it("bulk deletes assets (soft and hard delete) via http.post", async () => {
      vi.mocked(http.post).mockResolvedValue({ data: { success: true } });

      const softRes = await bulkDeleteAssetsApi(["asset-1"]);
      expect(http.post).toHaveBeenCalledWith("/assets/bulk-delete", {
        ids: ["asset-1"],
      });
      expect(softRes.success).toBe(true);

      const hardRes = await bulkDeleteAssetsApi(["asset-1"], true);
      expect(http.post).toHaveBeenCalledWith("/assets/bulk-delete?hard=true", {
        ids: ["asset-1"],
      });
      expect(hardRes.success).toBe(true);
    });

    it("bulk archives assets via http.post", async () => {
      vi.mocked(http.post).mockResolvedValueOnce({ data: { success: true } });

      const res = await bulkArchiveAssetsApi(["asset-1"]);
      expect(http.post).toHaveBeenCalledWith("/assets/bulk-archive", {
        ids: ["asset-1"],
      });
      expect(res.success).toBe(true);
    });

    it("bulk restores assets via http.post", async () => {
      vi.mocked(http.post).mockResolvedValueOnce({ data: { success: true } });

      const res = await bulkRestoreAssetsApi(["asset-1"]);
      expect(http.post).toHaveBeenCalledWith("/assets/bulk-restore", {
        ids: ["asset-1"],
      });
      expect(res.success).toBe(true);
    });

    it("reorders assets via http.patch", async () => {
      vi.mocked(http.patch).mockResolvedValueOnce({ data: { success: true } });

      const res = await reorderAssetsApi(["asset-2", "asset-1"]);
      expect(http.patch).toHaveBeenCalledWith("/assets/reorder", {
        ids: ["asset-2", "asset-1"],
      });
      expect(res.success).toBe(true);
    });
  });

  describe("Guest (Dexie) Mode", () => {
    beforeEach(() => {
      isGuestMode = true;
    });

    it("creates an asset with default fallback values in Dexie", async () => {
      const createdWithDefaults = await createAssetApi({
        name: "Pocket Cash",
        type: AssetType.CASH,
      });

      expect(createdWithDefaults.name).toBe("Pocket Cash");
      expect(createdWithDefaults.balance).toBe(0);
      expect(createdWithDefaults.includeInSnapshot).toBe(true);
      expect(createdWithDefaults.savingsAmount).toBe(0);
      expect(createdWithDefaults.isArchived).toBe(false);

      const createdWithCustom = await createAssetApi({
        name: "Custom Savings",
        type: AssetType.BANK,
        balance: 1000,
        includeInSnapshot: false,
        savingsAmount: 500,
      });

      expect(createdWithCustom.balance).toBe(1000);
      expect(createdWithCustom.includeInSnapshot).toBe(false);
      expect(createdWithCustom.savingsAmount).toBe(500);
    });

    it("fetches assets in guest mode filtering deleted by default", async () => {
      const activeAssets = await getAssetsApi(false);
      expect(activeAssets).toHaveLength(1);
      expect(activeAssets[0].id).toBe("asset-1");

      const allAssets = await getAssetsApi(true);
      expect(allAssets).toHaveLength(2);
    });

    it("updates existing asset or throws error when not found", async () => {
      const updated = await updateAssetApi("asset-1", {
        name: "Renamed Bank",
      });
      expect(updated.name).toBe("Renamed Bank");

      await expect(
        updateAssetApi("non-existent-id", { name: "Fail" }),
      ).rejects.toThrow("Asset not found");
    });

    it("restores asset or throws error when not found", async () => {
      const restored = await restoreAssetApi("asset-2");
      expect(restored.deletedAt).toBeNull();
      expect(restored.isArchived).toBe(false);

      await expect(restoreAssetApi("non-existent-id")).rejects.toThrow(
        "Asset not found",
      );
    });

    it("soft deletes and hard deletes asset or throws error when not found", async () => {
      const softDeleted = await deleteAssetApi("asset-1", false);
      expect(softDeleted.deletedAt).toBeTruthy();

      const hardDeleted = await deleteAssetApi("asset-2", true);
      expect(hardDeleted.id).toBe("asset-2");
      expect(mockLocalAssets.find((a) => a.id === "asset-2")).toBeUndefined();

      await expect(deleteAssetApi("non-existent-id")).rejects.toThrow(
        "Asset not found",
      );
    });

    it("bulk deletes assets in guest mode (soft and hard)", async () => {
      const softRes = await bulkDeleteAssetsApi(["asset-1"], false);
      expect(softRes.success).toBe(true);
      expect(
        mockLocalAssets.find((a) => a.id === "asset-1")?.deletedAt,
      ).toBeTruthy();

      const hardRes = await bulkDeleteAssetsApi(["asset-1"], true);
      expect(hardRes.success).toBe(true);
      expect(mockLocalAssets.find((a) => a.id === "asset-1")).toBeUndefined();
    });

    it("bulk archives assets in guest mode", async () => {
      const res = await bulkArchiveAssetsApi(["asset-1"]);
      expect(res.success).toBe(true);
      expect(mockLocalAssets.find((a) => a.id === "asset-1")?.isArchived).toBe(
        true,
      );
    });

    it("bulk restores assets in guest mode", async () => {
      const res = await bulkRestoreAssetsApi(["asset-2"]);
      expect(res.success).toBe(true);
      const asset = mockLocalAssets.find((a) => a.id === "asset-2");
      expect(asset?.isArchived).toBe(false);
      expect(asset?.deletedAt).toBeNull();
    });

    it("reorders assets in guest mode with displayOrder fallback", async () => {
      const res = await reorderAssetsApi(["asset-2"]);
      expect(res.success).toBe(true);

      const asset2 = mockLocalAssets.find((a) => a.id === "asset-2");
      expect(asset2?.displayOrder).toBe(1);

      // Test fallback when asset.id is not in orderMap
      vi.mocked(db.assets.where).mockReturnValueOnce({
        anyOf: vi.fn().mockReturnValueOnce({
          toArray: vi.fn().mockResolvedValueOnce([
            {
              id: "asset-unknown",
              name: "Unknown",
              type: AssetType.OTHER,
              balance: 0,
              displayOrder: 99,
            },
          ]),
        }),
      } as unknown as ReturnType<typeof db.assets.where>);

      const fallbackRes = await reorderAssetsApi(["asset-2"]);
      expect(fallbackRes.success).toBe(true);
    });
  });
});
