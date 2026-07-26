import { z } from "zod";

export const userSettingsResponseSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
});

export type UserSettingsResponse = z.infer<typeof userSettingsResponseSchema>;
