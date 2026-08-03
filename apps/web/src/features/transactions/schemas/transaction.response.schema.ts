import { z } from "zod";

export const transactionAssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  balance: z.number(),
});

export const transactionCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const transactionResponseSchema = z.object({
  id: z.string(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER", "ADJUSTMENT"]),
  amount: z.number(),
  note: z.string().nullable().optional(),
  transactionDate: z.string(),
  assetId: z.string(),
  toAssetId: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  attachmentUrl: z.string().nullable().optional(),
  asset: transactionAssetSchema.optional(),
  toAsset: transactionAssetSchema.nullable().optional(),
  category: transactionCategorySchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

export const transactionListResponseSchema = z.array(transactionResponseSchema);

export const paginatedTransactionResponseSchema = z.object({
  items: z.array(transactionResponseSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    nextCursor: z.string().nullable().optional(),
  }),
});

export type TransactionResponse = z.infer<typeof transactionResponseSchema>;
export type PaginatedTransactionResponse = z.infer<
  typeof paginatedTransactionResponseSchema
>;
