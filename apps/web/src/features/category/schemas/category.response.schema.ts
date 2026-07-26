import { z } from "zod";

export const categoryResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
  icon: z.string().optional(),
  userId: z.string().optional(),
  isSystem: z.boolean().optional().default(false),
  displayOrder: z.number().optional(),
  deletedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const categoryListResponseSchema = z.array(categoryResponseSchema);

export const reorderCategoryResponseSchema = z.object({
  success: z.boolean(),
});

export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;
export type ReorderCategoryResponse = z.infer<
  typeof reorderCategoryResponseSchema
>;
