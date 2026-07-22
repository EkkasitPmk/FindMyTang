import { z } from "zod";
import { userSchema } from "@/shared/lib/schemas/user.schema";

export const loginResponseSchema = z.object({
  user: userSchema,
  token: z.string().optional(),
});

export const registerResponseSchema = z.object({
  id: z.string(),
  email: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  createdAt: z.string().optional(),
});

export const syncGuestTransactionItemSchema = z.object({
  id: z.string().optional(),
  localId: z.string().optional(),
  type: z.string(),
  amount: z.number(),
  date: z.string(),
  assetId: z.string().optional(),
  localAssetId: z.string().optional(),
  toAssetId: z.string().nullable().optional(),
  localToAssetId: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  localCategoryId: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  attachmentUrl: z.string().nullable().optional(),
});

export const syncGuestResponseSchema = z.object({
  syncedAssetsCount: z.number().optional(),
  syncedCategoriesCount: z.number().optional(),
  syncedTransactionsCount: z.number().optional(),
  success: z.boolean().optional(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type SyncGuestResponse = z.infer<typeof syncGuestResponseSchema>;
