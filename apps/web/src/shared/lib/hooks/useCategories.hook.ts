import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/features/category/services/category.service";
import { Category } from "@/shared/lib/types/category.type";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";

export type UseCategoriesOptions = {
  includeDeleted?: boolean;
  enabled?: boolean;
};

export const useCategories = (options?: UseCategoriesOptions | boolean) => {
  const includeDeleted =
    typeof options === "boolean" ? options : (options?.includeDeleted ?? false);
  const enabled =
    typeof options === "boolean" ? true : (options?.enabled ?? true);
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery<Category[], Error>({
    queryKey: ["categories", { isGuest, includeDeleted }],
    queryFn: () => getCategoriesApi(includeDeleted),
    enabled,
  });
};
