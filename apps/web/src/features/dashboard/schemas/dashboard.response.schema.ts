import { z } from "zod";

export const todaySummaryResponseSchema = z.object({
  income: z.number(),
  expense: z.number(),
  net: z.number(),
  totalNetWorth: z.number(),
});

export type TodaySummaryResponse = z.infer<typeof todaySummaryResponseSchema>;
