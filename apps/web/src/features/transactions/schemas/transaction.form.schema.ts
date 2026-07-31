import * as z from "zod";

export const createTransactionSchema = z.object({
  assetId: z.string().min(1, { message: "Please select an asset" }),
  categoryId: z.string().optional(),
  toAssetId: z.string().optional(),
  amount: z
    .number({ message: "Amount must be a number" })
    .positive({ message: "Amount must be greater than 0" }),
  note: z.string().max(255).optional(),
  transactionDate: z.string().min(1, { message: "Date is required" }),
  file: z.any().optional(),
});

export type CreateTransactionFormValues = z.infer<
  typeof createTransactionSchema
>;
