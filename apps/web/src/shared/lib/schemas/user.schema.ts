import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  displayName: z.string(),
  avatarUrl: z.string().nullable().optional(),
  language: z.string().optional(),
  lastSyncedAt: z.string().nullable().optional(),
  lastSyncStatus: z.string().nullable().optional(),
  syncRevision: z.number().optional(),
});

export type User = z.infer<typeof userSchema>;
