import {
  RecurringCycle,
  RecurringStatus,
  type LocalRecurringExpense,
} from "../storages/dexie.storage";

export { RecurringCycle, RecurringStatus };

export interface RecurringExpense extends LocalRecurringExpense {
  category?: {
    id: string;
    name: string;
    type?: string;
    color?: string | null;
    icon?: string | null;
  } | null;
  asset?: {
    id: string;
    name: string;
    type?: string;
    balance?: number;
  } | null;
}

export interface CreateRecurringExpenseRequest {
  name: string;
  amount: number;
  currency?: string;
  billingCycle: RecurringCycle;
  firstBillingDate: string;
  nextBillingDate: string;
  categoryId?: string | null;
  assetId?: string | null;
  status?: RecurringStatus;
  note?: string | null;
}

export type UpdateRecurringExpenseRequest =
  Partial<CreateRecurringExpenseRequest>;

export interface RecurringSummaryMetrics {
  totalMonthly: number;
  totalYearly: number;
  activeCount: number;
  upcomingDueItem: RecurringExpense | null;
}
