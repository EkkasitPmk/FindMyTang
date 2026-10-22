import { z } from "zod";

export const recurringExpenseResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  currency: z.string().default("THB"),
  billingCycle: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]),
  firstBillingDate: z.string(),
  nextBillingDate: z.string(),
  status: z.enum(["ACTIVE", "PAUSED"]),
  userId: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  assetId: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  deletedAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.string().optional(),
      color: z.string().nullable().optional(),
      icon: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  asset: z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.string().optional(),
      balance: z.number().optional(),
    })
    .nullable()
    .optional(),
});

export const recurringExpenseListResponseSchema = z.array(
  recurringExpenseResponseSchema,
);

export type RecurringExpenseResponse = z.infer<
  typeof recurringExpenseResponseSchema
>;
export type RecurringExpenseListResponse = z.infer<
  typeof recurringExpenseListResponseSchema
>;
