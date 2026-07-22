import { z } from "zod";

export const journalEntryResponseSchema = z.object({
  date: z.string(),
  totalIncome: z.number(),
  totalExpense: z.number(),
  net: z.number(),
});

export type JournalEntryResponse = z.infer<typeof journalEntryResponseSchema>;
