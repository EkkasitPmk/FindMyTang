import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/features/category/services/category.service";
import { Category } from "@/shared/lib/types/category.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export const useCategories = () => {
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery<Category[], Error>({
    queryKey: ["categories", { isGuest }],
    queryFn: getCategoriesApi,
  });
};
