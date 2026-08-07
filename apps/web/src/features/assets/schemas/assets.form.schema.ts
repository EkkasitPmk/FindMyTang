import * as z from "zod";
import { AssetType } from "@/shared/lib/types/asset.type";

export const createAssetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Asset name is required" })
    .max(30, { message: "Asset name must not exceed 30 characters" })
    .refine((val) => val.trim().length > 0, {
      message: "Asset name must not be empty or whitespace only",
    }),
  type: z.enum(Object.values(AssetType) as [AssetType, ...AssetType[]]),
  balance: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .refine(
      (val) => {
        if (val === "" || val === null || val === undefined) return true;
        const num = Number(val);
        return !Number.isNaN(num);
      },
      { message: "Balance must be a number" },
    )
    .refine(
      (val) => {
        if (val === "" || val === null || val === undefined) return true;
        const num = Number(val);
        return num >= 1;
      },
      { message: "Balance must be greater than or equal to 1" },
    )
    .refine(
      (val) => {
        if (val === "" || val === null || val === undefined) return true;
        return Number(val) <= 99999999.99;
      },
      { message: "Balance must not exceed 99,999,999.99" },
    )
    .optional(),
  color: z.string().optional(),
});

export const editAssetSchema = createAssetSchema.extend({
  balance: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .optional(),
});

export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;
