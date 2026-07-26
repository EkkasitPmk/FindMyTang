import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import {
  createCategoryApi,
  deleteCategory,
  reorderCategoriesApi,
  restoreCategoryApi,
  updateCategory,
} from "../services/category.service";
import {
  Category,
  CreateCategoryRequest,
} from "@/shared/lib/types/category.type";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/shared/lib/types/api.type";

export const useCreateCategoryMutation = (options?: {
  onSuccess?: (data: Category) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    AxiosError<ApiErrorResponse>,
    CreateCategoryRequest
  >({
    mutationFn: (data) => createCategoryApi(data),
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useUpdateCategoryMutation = (options?: {
  onSuccess?: (data: Category) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    AxiosError<ApiErrorResponse>,
    { id: string; data: Partial<CreateCategoryRequest> }
  >({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useRestoreCategoryMutation = (options?: {
  onSuccess?: (data: Category) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<Category, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (id) => restoreCategoryApi(id),
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useDeleteCategoryMutation = (options?: {
  onSuccess?: (data: Category) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    AxiosError<ApiErrorResponse>,
    { id: string; isHardDelete?: boolean } | string
  >({
    mutationFn: (param) => {
      if (typeof param === "string") {
        return deleteCategory(param, false);
      }
      return deleteCategory(param.id, param.isHardDelete);
    },
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useReorderCategoriesMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    AxiosError<ApiErrorResponse>,
    string[]
  >({
    mutationFn: (ids) => reorderCategoriesApi(ids),
    ...options,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.();
    },
  });
};

interface CategoryUIStore {
  isEditingList: boolean;
  toggleEditingList: () => void;
  setEditingList: (value: boolean) => void;
  hasCategories: boolean;
  setHasCategories: (value: boolean) => void;
}

export const useCategoryUIStore = create<CategoryUIStore>((set) => ({
  isEditingList: false,
  toggleEditingList: () =>
    set((state) => ({ isEditingList: !state.isEditingList })),
  setEditingList: (value) => set({ isEditingList: value }),
  hasCategories: true,
  setHasCategories: (value) => set({ hasCategories: value }),
}));
