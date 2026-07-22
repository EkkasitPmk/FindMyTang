import * as z from "zod";
import { AssetType } from "@/shared/lib/types/asset.type";

export const createAssetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Asset name is required" })
    .max(100, { message: "Asset name must not exceed 100 characters" })
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
    .optional(),
  color: z.string().optional(),
});

export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;
