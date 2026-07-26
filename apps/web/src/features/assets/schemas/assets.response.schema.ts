import { z } from "zod";
import { AssetType } from "@/shared/lib/types/asset.type";

export const assetResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(Object.values(AssetType) as [AssetType, ...AssetType[]]),
  balance: z.number(),
  color: z.string().nullable().optional(),
  isArchived: z.boolean().optional().default(false),
  deletedAt: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const assetListResponseSchema = z.array(assetResponseSchema);

export const assetMutationResponseSchema = z.object({
  success: z.boolean(),
});

export type AssetResponse = z.infer<typeof assetResponseSchema>;
export type AssetListResponse = z.infer<typeof assetListResponseSchema>;
