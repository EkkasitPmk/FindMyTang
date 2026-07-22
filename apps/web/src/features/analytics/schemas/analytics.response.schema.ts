import { z } from "zod";

export const categoryBreakdownItemSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  categoryColor: z.string().nullable().optional(),
  categoryIcon: z.string().nullable().optional(),
  totalAmount: z.number(),
  percentage: z.number(),
  transactionCount: z.number(),
});

export const categoryBreakdownResponseSchema = z.object({
  summary: z.object({
    income: z.number(),
    expense: z.number(),
    transfer: z.number(),
    adjust: z.number(),
    net: z.number(),
  }),
  breakdown: z.array(categoryBreakdownItemSchema),
});

export const monthlyTrendItemSchema = z.object({
  month: z.number(),
  income: z.number(),
  expense: z.number(),
  transfer: z.number(),
  adjust: z.number(),
  net: z.number(),
});

export const monthlyTrendsResponseSchema = z.object({
  year: z.number(),
  months: z.array(monthlyTrendItemSchema),
});

export const drilldownTransactionSchema = z.object({
  id: z.string(),
  type: z.string(),
  amount: z.number(),
  note: z.string().nullable().optional(),
  date: z.string(),
  asset: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
  }),
});

export const drilldownSummarySchema = z.object({
  currentMonth: z.number(),
  previousMonth: z.number(),
  percentageChange: z.number(),
  percentageOfTotal: z.number(),
});

export const drilldownCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().nullable(),
  icon: z.string().nullable(),
});

export const drilldownResponseSchema = z.object({
  category: drilldownCategorySchema,
  summary: drilldownSummarySchema,
  transactions: z.array(drilldownTransactionSchema),
});

export const assetDistributionItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().nullable().optional(),
  balance: z.number(),
  percentage: z.number().optional(),
});

export const assetDistributionGroupSchema = z.object({
  assetType: z.string(),
  totalBalance: z.number(),
  percentage: z.number(),
  assets: z.array(assetDistributionItemSchema),
});

export const assetDistributionResponseSchema = z.object({
  totalAssets: z.number(),
  distribution: z.array(assetDistributionGroupSchema),
});

export type CategoryBreakdownItem = z.infer<typeof categoryBreakdownItemSchema>;
export type CategoryBreakdownResponse = z.infer<
  typeof categoryBreakdownResponseSchema
>;
export type MonthlyTrendItem = z.infer<typeof monthlyTrendItemSchema>;
export type MonthlyTrendsResponse = z.infer<typeof monthlyTrendsResponseSchema>;
export type DrilldownTransaction = z.infer<typeof drilldownTransactionSchema>;
export type DrilldownSummary = z.infer<typeof drilldownSummarySchema>;
export type DrilldownResponse = z.infer<typeof drilldownResponseSchema>;
export type AssetDistributionItem = z.infer<typeof assetDistributionItemSchema>;
export type AssetDistributionGroup = z.infer<
  typeof assetDistributionGroupSchema
>;
export type AssetDistributionResponse = z.infer<
  typeof assetDistributionResponseSchema
>;
