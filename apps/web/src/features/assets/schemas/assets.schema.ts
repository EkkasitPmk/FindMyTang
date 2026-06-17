import * as z from "zod";
import { AssetType } from "../types/assets.type";

export const createAssetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Asset name is required" })
    .max(100, { message: "Asset name must not exceed 100 characters" })
    .refine((val) => val.trim().length > 0, {
      message: "Asset name must not be empty or whitespace only",
    }),
  type: z.enum(AssetType),
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
    .optional(),
  currency: z
    .string()
    .min(1, { message: "Currency is required" })
    .max(10, { message: "Currency must not exceed 10 characters" })
    .optional(),
});

export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;
