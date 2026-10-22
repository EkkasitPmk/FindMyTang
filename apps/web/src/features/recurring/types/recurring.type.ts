import { RecurringStatus } from "@/shared/lib/types/recurring.type";

export type RecurringFilterType =
  | "ALL"
  | RecurringStatus.ACTIVE
  | RecurringStatus.PAUSED;
