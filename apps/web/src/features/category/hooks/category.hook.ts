import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryApi,
  getCategoriesApi,
  updateCategory,
  deleteCategory,
} from "../services/category.service";
import { Category, CreateCategoryRequest } from "../types/category.type";
import { AxiosError } from "axios";

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
  return useMutation<
    Category,
    AxiosError<ApiErrorResponse>,
    CreateCategoryRequest
  >({
    mutationFn: createCategoryApi,
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

export const useCategories = () => {
  return useQuery<Category[], AxiosError<ApiErrorResponse>>({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });
};

export const useDeleteCategoryMutation = (options?: {
  onSuccess?: (data: Category) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<Category, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deleteCategory,
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      options?.onSuccess?.(data);
    },
  });
};
