import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { SyncGuestRequest, SyncGuestResponse } from "../types/auth.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { toast } from "react-toastify";

export const useSyncGuestMutation = () => {
  const clearGuestData = useGuestStore((state) => state.clearGuestData);
  const assets = useGuestStore((state) => state.assets);
  const categories = useGuestStore((state) => state.categories);
  const transactions = useGuestStore((state) => state.transactions);

  return useMutation<SyncGuestResponse, Error, void>({
    mutationFn: async () => {
      // แปลงข้อมูลจาก Local Guest Store ให้เข้าคู่กับ SyncGuestRequest (API Dto)
      const requestData: SyncGuestRequest = {
        assets: assets.map((asset) => ({
          localId: asset.id,
          name: asset.name,
          type: asset.type,
          balance: asset.balance,
          color: asset.color || undefined,
        })),
        categories: categories.map((cat) => ({
          localId: cat.id,
          name: cat.name,
          type: cat.type,
          color: cat.color || undefined,
          icon: cat.icon || undefined,
        })),
        transactions: transactions.map((tx) => ({
          localId: tx.id,
          localAssetId: tx.assetId,
          localToAssetId: tx.toAssetId || undefined,
          localCategoryId: tx.categoryId || undefined,
          type: tx.type,
          amount: tx.amount,
          note: tx.note || undefined,
          date: tx.transactionDate, // map transactionDate -> date
        })),
      };

      return authService.syncGuest(requestData);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("ข้อมูล Guest ถูกซิงค์เรียบร้อยแล้ว");
        clearGuestData(); // ล้างข้อมูล local หลังจากซิงค์สำเร็จ
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message;
      toast.error(`เกิดข้อผิดพลาดในการซิงค์ข้อมูล: ${errorMessage}`);
    },
  });
};
