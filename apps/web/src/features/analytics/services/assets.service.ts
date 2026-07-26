import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db } from "@/shared/lib/storages/dexie.storage";
import http from "@/shared/lib/api/http";
import {
  AssetDistributionResponse,
  AssetDistributionItem,
  assetDistributionResponseSchema,
} from "../schemas/analytics.response.schema";

export const getAssetDistributionApi =
  async (): Promise<AssetDistributionResponse> => {
    if (useGuestStore.getState().isGuest) {
      const assets = await db.assets.filter((a) => !a.deletedAt).toArray();

      let totalAssets = 0;
      const typeMap = new Map<
        string,
        { total: number; assets: AssetDistributionItem[] }
      >();

      assets.forEach((a) => {
        totalAssets += a.balance;
        const existing = typeMap.get(a.type) || { total: 0, assets: [] };
        existing.total += a.balance;
        existing.assets.push({
          id: a.id,
          name: a.name,
          color: a.color || null,
          balance: a.balance,
        });
        typeMap.set(a.type, existing);
      });

      const distribution = Array.from(typeMap.entries())
        .map(([assetType, data]) => ({
          assetType,
          totalBalance: data.total,
          percentage: totalAssets > 0 ? (data.total / totalAssets) * 100 : 0,
          assets: data.assets.toSorted((a, b) => b.balance - a.balance),
        }))
        .sort((a, b) => b.totalBalance - a.totalBalance);

      return assetDistributionResponseSchema.parse({
        totalAssets,
        distribution,
      });
    }

    const response =
      await http.get<AssetDistributionResponse>("/analytics/assets");
    return assetDistributionResponseSchema.parse(response.data);
  };
