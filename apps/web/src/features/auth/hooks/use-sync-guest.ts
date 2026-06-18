import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { SyncGuestRequest, SyncGuestResponse } from "../types/auth.type";
import { useGuestStore } from "@/shared/lib/store/guest-store";
import { toast } from "react-toastify";

export const useSyncGuestMutation = () => {
  const clearGuestData = useGuestStore((state) => state.clearGuestData);

  return useMutation<SyncGuestResponse, Error, SyncGuestRequest>({
    mutationFn: authService.syncGuest,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("ข้อมูล Guest ถูกซิงค์เรียบร้อยแล้ว");
        clearGuestData(); // ล้างข้อมูล local หลังจากซิงค์สำเร็จ
      }
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการซิงค์ข้อมูล: ${error.message}`);
    },
  });
};
