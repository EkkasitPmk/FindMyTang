import http from "@/shared/lib/api/http";
import {
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateAssetResponse,
  Asset,
} from "../types/assets.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db, AssetType } from "@/shared/lib/storages/dexie.storage";
import { v4 as uuidv4 } from "uuid";

export const createAssetApi = async (
  data: CreateAssetRequest,
): Promise<CreateAssetResponse> => {
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
    return newAsset as unknown as CreateAssetResponse;
  }
  const response = await http.post<CreateAssetResponse>("/assets", data);
  return response.data;
};

export const getAssetsApi = async (
  includeDeleted = false,
): Promise<Asset[]> => {
  if (useGuestStore.getState().isGuest) {
    let collection = db.assets.toCollection();
    if (!includeDeleted) {
      collection = db.assets.filter((a) => !a.deletedAt);
    }
    const assets = await collection.sortBy("displayOrder");
    return assets as unknown as Asset[];
  }
  const query = includeDeleted ? "?includeDeleted=true" : "";
  const response = await http.get<Asset[]>(`/assets${query}`);
  return response.data;
};

export const updateAssetApi = async (
  id: string,
  data: UpdateAssetRequest,
): Promise<CreateAssetResponse> => {
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
    return updated as unknown as CreateAssetResponse;
  }
  const response = await http.patch<CreateAssetResponse>(`/assets/${id}`, data);
  return response.data;
};

export const restoreAssetApi = async (id: string): Promise<Asset> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.assets.get(id);
    if (!existing) throw new Error("Asset not found");
    existing.deletedAt = null;
    existing.isArchived = false;
    existing.updatedAt = new Date().toISOString();
    existing.syncStatus = "pending";
    await db.assets.put(existing);
    return existing as unknown as Asset;
  }
  const response = await http.patch<Asset>(`/assets/${id}/restore`);
  return response.data;
};

export const deleteAssetApi = async (
  id: string,
  hardDelete?: boolean,
): Promise<Asset> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.assets.get(id);
    if (!existing) throw new Error("Asset not found");
    if (hardDelete) {
      await db.assets.delete(id);
      return existing as unknown as Asset;
    } else {
      existing.deletedAt = new Date().toISOString();
      existing.updatedAt = new Date().toISOString();
      existing.syncStatus = "pending";
      await db.assets.put(existing);
      return existing as unknown as Asset;
    }
  }
  const query = hardDelete ? "?hard=true" : "";
  const response = await http.delete<Asset>(`/assets/${id}${query}`);
  return response.data;
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
    return { success: true };
  }
  const query = hardDelete ? "?hard=true" : "";
  const response = await http.post<{ success: boolean }>(
    `/assets/bulk-delete${query}`,
    { ids },
  );
  return response.data;
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
    return { success: true };
  }
  const response = await http.post<{ success: boolean }>(
    "/assets/bulk-archive",
    { ids },
  );
  return response.data;
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
    return { success: true };
  }
  const response = await http.post<{ success: boolean }>(
    "/assets/bulk-restore",
    { ids },
  );
  return response.data;
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
    return { success: true };
  }
  const response = await http.patch<{ success: boolean }>("/assets/reorder", {
    ids,
  });
  return response.data;
};
