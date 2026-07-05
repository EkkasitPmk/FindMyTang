import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import {
  createCategoryApi,
  getCategoriesApi,
  updateCategory,
  deleteCategory,
  reorderCategoriesApi,
} from "../services/category.service";
import { Category, CreateCategoryRequest } from "../types/category.type";
import { AxiosError } from "axios";
import { useGuestStore, useIsGuest } from "@/shared/lib/storages/guest.storage";

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export const useCreateCategoryMutation = (options?: {
  onSuccess?: (data: Category) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const addCategory = useGuestStore((state) => state.addCategory);

  return useMutation<
    Category,
    AxiosError<ApiErrorResponse>,
    CreateCategoryRequest
  >({
    mutationFn: async (data) => {
      if (isGuest) {
        const mockResponse: Category = {
          id: crypto.randomUUID(),
          name: data.name,
          type: data.type,
          color: data.color,
          icon: data.icon,
          userId: "guest",
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return mockResponse;
      }
      return createCategoryApi(data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        addCategory(data);
      } else {
        void queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useUpdateCategoryMutation = (options?: {
  onSuccess?: (data: Category) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const updateCategoryStore = useGuestStore((state) => state.updateCategory);

  return useMutation<
    Category,
    AxiosError<ApiErrorResponse>,
    { id: string; data: Partial<CreateCategoryRequest> }
  >({
    mutationFn: async ({ id, data }) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const existingCategory = state.categories.find((c) => c.id === id);
        if (!existingCategory) {
          throw new Error("Category not found");
        }
        const mockResponse: Category = {
          ...existingCategory,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return mockResponse;
      }
      return updateCategory(id, data);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        updateCategoryStore(data.id, data);
      } else {
        void queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useCategories = () => {
  const isGuest = useIsGuest();
  const guestCategories = useGuestStore((state) => state.categories);

  return useQuery<Category[], AxiosError<ApiErrorResponse>>({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
    enabled: !isGuest,
    initialData: isGuest ? guestCategories : undefined,
  });
};

export const useDeleteCategoryMutation = (options?: {
  onSuccess?: (data: Category) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);
  const deleteCategoryStore = useGuestStore((state) => state.deleteCategory);

  return useMutation<Category, AxiosError<ApiErrorResponse>, string>({
    mutationFn: async (id) => {
      if (isGuest) {
        const state = useGuestStore.getState();
        const existingCategory = state.categories.find((c) => c.id === id);
        if (!existingCategory) {
          throw new Error("Category not found");
        }
        return existingCategory;
      }
      return deleteCategory(id);
    },
    ...options,
    onSuccess: (data) => {
      if (isGuest) {
        deleteCategoryStore(data.id);
      } else {
        void queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

export const useReorderCategoriesMutation = (options?: {
  onSuccess?: (data: { success: boolean }) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  const isGuest = useGuestStore((state) => state.isGuest);

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    string[]
  >({
    mutationFn: async (ids) => {
      if (isGuest) {
        // ponytail: Mock category reordering inside the guest store.
        const state = useGuestStore.getState();
        const categoryMap = new Map(state.categories.map((c) => [c.id, c]));
        const reorderedCats: Category[] = [];
        ids.forEach((id) => {
          const cat = categoryMap.get(id);
          if (cat) {
            reorderedCats.push(cat);
          }
        });
        state.categories.forEach((cat) => {
          if (!ids.includes(cat.id)) {
            reorderedCats.push(cat);
          }
        });
        reorderedCats.forEach((cat, idx) => {
          cat.displayOrder = idx + 1;
        });
        useGuestStore.setState({ categories: reorderedCats });
        return { success: true };
      }
      return reorderCategoriesApi(ids);
    },
    ...options,
    onSuccess: (data) => {
      if (!isGuest) {
        void queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
      options?.onSuccess?.(data);
    },
  });
};

interface CategoryUIStore {
  isEditingList: boolean;
  toggleEditingList: () => void;
  setEditingList: (value: boolean) => void;
}

export const useCategoryUIStore = create<CategoryUIStore>((set) => ({
  isEditingList: false,
  toggleEditingList: () =>
    set((state) => ({ isEditingList: !state.isEditingList })),
  setEditingList: (value) => set({ isEditingList: value }),
}));
