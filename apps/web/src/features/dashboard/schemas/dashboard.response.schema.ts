import { z } from "zod";

export const todaySummaryResponseSchema = z.object({
  income: z.number(),
  expense: z.number(),
  transfer: z.number(),
  adjustment: z.number(),
  net: z.number(),
  totalNetWorth: z.number(),
  excludedNetWorth: z.number().optional().default(0),
});

export type TodaySummaryResponse = z.infer<typeof todaySummaryResponseSchema>;
