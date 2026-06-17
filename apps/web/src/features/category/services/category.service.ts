import http from "@/shared/lib/api/http";
import { Category, CreateCategoryRequest } from "../types/category.type";

export const createCategoryApi = async (
  data: CreateCategoryRequest,
): Promise<Category> => {
  // ponytail: Category creation api call.
  const response = await http.post<Category>("/categories", data);
  return response.data;
};

export const getCategoriesApi = async (): Promise<Category[]> => {
  // ponytail: Fetch all categories api call.
  const response = await http.get<Category[]>("/categories");
  return response.data;
};
