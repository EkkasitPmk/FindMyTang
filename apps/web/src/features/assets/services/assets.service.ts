import http from "@/shared/lib/api/http";
import {
  CreateAssetRequest,
  UpdateAssetRequest,
  AssetType,
} from "@/shared/lib/types/asset.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db } from "@/shared/lib/storages/dexie.storage";
import { v4 as uuidv4 } from "uuid";
import {
  assetResponseSchema,
  assetListResponseSchema,
  assetMutationResponseSchema,
  AssetResponse,
  AssetListResponse,
} from "../schemas/assets.response.schema";

export const createAssetApi = async (
  data: CreateAssetRequest,
): Promise<AssetResponse> => {
  if (useGuestStore.getState().isGuest) {
    const newAsset = {
      id: uuidv4(),
      ...data,
      type: data.type as unknown as AssetType,
      balance: data.balance ?? 0,
      isArchived: false,
      displayOrder: (await db.assets.count()) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      syncStatus: "pending" as const,
    };
    await db.assets.add(newAsset);
    return assetResponseSchema.parse(newAsset);
  }
  const response = await http.post("/assets", data);
  return assetResponseSchema.parse(response.data);
};

export const getAssetsApi = async (
  includeDeleted = false,
): Promise<AssetListResponse> => {
  if (useGuestStore.getState().isGuest) {
    let collection = db.assets.toCollection();
    if (!includeDeleted) {
      collection = db.assets.filter((a) => !a.deletedAt);
    }
    const assets = await collection.sortBy("displayOrder");
    return assetListResponseSchema.parse(assets);
  }
  const query = includeDeleted ? "?includeDeleted=true" : "";
  const response = await http.get(`/assets${query}`);
  return assetListResponseSchema.parse(response.data);
};

export const updateAssetApi = async (
  id: string,
  data: UpdateAssetRequest,
): Promise<AssetResponse> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.assets.get(id);
    if (!existing) throw new Error("Asset not found");
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      syncStatus: "pending" as const,
    };
    await db.assets.put(updated);
    return assetResponseSchema.parse(updated);
  }
  const response = await http.patch(`/assets/${id}`, data);
  return assetResponseSchema.parse(response.data);
};

export const restoreAssetApi = async (id: string): Promise<AssetResponse> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.assets.get(id);
    if (!existing) throw new Error("Asset not found");
    existing.deletedAt = null;
    existing.isArchived = false;
    existing.updatedAt = new Date().toISOString();
    existing.syncStatus = "pending";
    await db.assets.put(existing);
    return assetResponseSchema.parse(existing);
  }
  const response = await http.patch(`/assets/${id}/restore`);
  return assetResponseSchema.parse(response.data);
};

export const deleteAssetApi = async (
  id: string,
  hardDelete?: boolean,
): Promise<AssetResponse> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.assets.get(id);
    if (!existing) throw new Error("Asset not found");
    if (hardDelete) {
      await db.assets.delete(id);
      return assetResponseSchema.parse(existing);
    } else {
      existing.deletedAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
      existing.syncStatus = "pending";
      await db.assets.put(existing);
      return assetResponseSchema.parse(existing);
    }
  }
  const query = hardDelete ? "?hard=true" : "";
  const response = await http.delete(`/assets/${id}${query}`);
  return assetResponseSchema.parse(response.data);
};

export const bulkDeleteAssetsApi = async (
  ids: string[],
  hardDelete?: boolean,
): Promise<{ success: boolean }> => {
  if (useGuestStore.getState().isGuest) {
    if (hardDelete) {
      await db.assets.bulkDelete(ids);
    } else {
      const now = new Date().toISOString();
      await db.transaction("rw", db.assets, async () => {
        const assets = await db.assets.where("id").anyOf(ids).toArray();
        assets.forEach((a) => {
          a.deletedAt = now;
          a.updatedAt = now;
          a.syncStatus = "pending";
        });
        await db.assets.bulkPut(assets);
      });
    }
    return assetMutationResponseSchema.parse({ success: true });
  }
  const query = hardDelete ? "?hard=true" : "";
  const response = await http.post(`/assets/bulk-delete${query}`, { ids });
  return assetMutationResponseSchema.parse(response.data);
};

export const bulkArchiveAssetsApi = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  if (useGuestStore.getState().isGuest) {
    const now = new Date().toISOString();
    await db.transaction("rw", db.assets, async () => {
      const assets = await db.assets.where("id").anyOf(ids).toArray();
      assets.forEach((a) => {
        a.isArchived = true;
        a.updatedAt = now;
        a.syncStatus = "pending";
      });
      await db.assets.bulkPut(assets);
    });
    return assetMutationResponseSchema.parse({ success: true });
  }
  const response = await http.post("/assets/bulk-archive", { ids });
  return assetMutationResponseSchema.parse(response.data);
};

export const bulkRestoreAssetsApi = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  if (useGuestStore.getState().isGuest) {
    const now = new Date().toISOString();
    await db.transaction("rw", db.assets, async () => {
      const assets = await db.assets.where("id").anyOf(ids).toArray();
      assets.forEach((a) => {
        a.isArchived = false;
        a.deletedAt = null;
        a.updatedAt = now;
        a.syncStatus = "pending";
      });
      await db.assets.bulkPut(assets);
    });
    return assetMutationResponseSchema.parse({ success: true });
  }
  const response = await http.post("/assets/bulk-restore", { ids });
  return assetMutationResponseSchema.parse(response.data);
};

export const reorderAssetsApi = async (
  ids: string[],
): Promise<{ success: boolean }> => {
  if (useGuestStore.getState().isGuest) {
    await db.transaction("rw", db.assets, async () => {
      for (let i = 0; i < ids.length; i++) {
        const asset = await db.assets.get(ids[i]);
        if (asset) {
          asset.displayOrder = i + 1;
          asset.updatedAt = new Date().toISOString();
          asset.syncStatus = "pending";
          await db.assets.put(asset);
        }
      }
    });
    return assetMutationResponseSchema.parse({ success: true });
  }
  const response = await http.patch("/assets/reorder", { ids });
  return assetMutationResponseSchema.parse(response.data);
};
