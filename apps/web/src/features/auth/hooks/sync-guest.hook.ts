import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AssetType } from "@/shared/lib/types/asset.type";
import { CategoryType } from "@/shared/lib/types/category.type";
import { TransactionType } from "@/shared/lib/types/transaction.type";
import { authService } from "../services/auth.service";
import { SyncGuestRequest, SyncGuestResponse } from "../types/auth.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { db } from "@/shared/lib/storages/dexie.storage";
import { toast } from "react-toastify";

export const useSyncGuestMutation = () => {
  const queryClient = useQueryClient();
  const clearGuestData = useGuestStore((state) => state.clearGuestData);

  return useMutation<
    SyncGuestResponse,
    AxiosError<{ message: string | string[] }>,
    void
  >({
    mutationFn: async () => {
      const assets = await db.assets.toArray();
      const categories = await db.categories.toArray();
      const transactions = await db.transactions.toArray();

      // แปลงข้อมูลจาก Local Guest Store ให้เข้าคู่กับ SyncGuestRequest (API Dto)
      const requestData: SyncGuestRequest = {
        assets: assets.map((asset) => ({
          localId: asset.id,
          name: asset.name,
          type: asset.type as unknown as AssetType,
          balance: asset.balance,
          color: asset.color || undefined,
          displayOrder: asset.displayOrder,
          isArchived: asset.isArchived,
          deletedAt: asset.deletedAt,
        })),
        categories: categories.map((cat) => ({
          localId: cat.id,
          name: cat.name,
          type: cat.type as unknown as CategoryType,
          color: cat.color || undefined,
          icon: cat.icon || undefined,
          displayOrder: cat.displayOrder,
          isSystem: cat.isSystem,
          deletedAt: cat.deletedAt,
        })),
        transactions: transactions.map((tx) => ({
          localId: tx.id,
          localAssetId: tx.assetId,
          localToAssetId: tx.toAssetId || undefined,
          localCategoryId: tx.categoryId || undefined,
          type: tx.type as unknown as TransactionType,
          amount: tx.amount,
          note: tx.note || undefined,
          date: tx.date,
          attachmentUrl: tx.attachmentUrl || undefined,
          deletedAt: tx.deletedAt,
        })),
      };

      return authService.syncGuest(requestData);
    },
    onSuccess: (data) => {
      if (data.success) {
        const assetsCount = data.syncedAssetsCount ?? 0;
        const categoriesCount = data.syncedCategoriesCount ?? 0;
        const txCount = data.syncedTransactionsCount ?? 0;

        if (assetsCount === 0 && categoriesCount === 0 && txCount === 0) {
          toast.info("การซิงค์เสร็จสิ้น (ไม่มีข้อมูล Guest ใหม่ที่ต้องซิงค์)");
        } else {
          toast.success(
            `ซิงค์ข้อมูล Guest สำเร็จ: สินทรัพย์ ${assetsCount} รายการ, หมวดหมู่ ${categoriesCount} รายการ, ธุรกรรม ${txCount} รายการ`,
          );
        }

        void clearGuestData(); // ล้างข้อมูล local หลังจากซิงค์สำเร็จ
        void queryClient.invalidateQueries(); // invalidate แคลชเพื่อให้ดึงข้อมูลใหม่มาแสดงทันที
      }
    },
    onError: (error: AxiosError<{ message: string | string[] }>) => {
      const responseMessage = error?.response?.data?.message;
      const errorMessage = Array.isArray(responseMessage)
        ? responseMessage[0]
        : responseMessage || error.message;
      toast.error(`เกิดข้อผิดพลาดในการซิงค์ข้อมูล: ${errorMessage}`);
    },
  });
};
