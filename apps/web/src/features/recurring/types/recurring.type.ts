import { RecurringStatus } from "@/shared/lib/storages/dexie.storage";

export type RecurringFilterType =
  | "ALL"
  | RecurringStatus.ACTIVE
  | RecurringStatus.PAUSED;
