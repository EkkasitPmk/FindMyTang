import * as z from "zod";

export const createExpenseSchema = z.object({
  assetId: z.string().min(1, { message: "Please select an asset" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
  amount: z
    .number({ message: "Amount must be a number" })
    .positive({ message: "Amount must be greater than 0" }),
  note: z.string().max(500).optional(),
  transactionDate: z.string().min(1, { message: "Date is required" }),
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseSchema>;
