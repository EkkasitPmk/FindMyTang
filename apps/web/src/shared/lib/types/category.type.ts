import { CategoryResponse } from "@/features/category/schemas/category.response.schema";

export type CategoryType = "INCOME" | "EXPENSE";
export type Category = CategoryResponse;

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  displayOrder?: number;
}
