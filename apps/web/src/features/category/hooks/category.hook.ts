import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategoryApi, getCategoriesApi } from "../services/category.service";
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
  return useMutation<Category, AxiosError<ApiErrorResponse>, CreateCategoryRequest>({
    mutationFn: createCategoryApi,
    ...options,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
