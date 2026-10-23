import http from "@/shared/lib/api/http";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import {
  db,
  LocalRecurringExpense,
  RecurringStatus,
} from "@/shared/lib/storages/dexie.storage";
import { v4 as uuidv4 } from "uuid";
import {
  RecurringExpense,
  CreateRecurringExpenseRequest,
  UpdateRecurringExpenseRequest,
} from "@/shared/lib/types/recurring.type";
import { createTransactionApi } from "@/features/transactions/services/transaction.service";
import { getNextBillingDate } from "../helpers/recurring.helper";

const mapLocalRecurringToResponse = async (
  item: LocalRecurringExpense,
): Promise<RecurringExpense> => {
  const result: RecurringExpense = {
    ...item,
    amount: Number(item.amount),
  };

  if (item.categoryId) {
    const category = await db.categories.get(item.categoryId);
    if (category) {
      result.category = {
        id: category.id,
        name: category.name,
        type: category.type as string,
        color: category.color ?? null,
        icon: category.icon ?? null,
      };
    }
  }

  if (item.assetId) {
    const asset = await db.assets.get(item.assetId);
    if (asset) {
      result.asset = {
        id: asset.id,
        name: asset.name,
        type: asset.type as string,
        balance: asset.balance,
      };
    }
  }

  return result;
};

export const getRecurringExpensesApi = async (
  status?: RecurringStatus,
): Promise<RecurringExpense[]> => {
  if (useGuestStore.getState().isGuest) {
    let items = await db.recurringExpenses.toArray();

    if (status) {
      items = items.filter((item) => item.status === status);
    }

    const enriched = await Promise.all(
      items.map((item) => mapLocalRecurringToResponse(item)),
    );
    return enriched;
  }

  const response = await http.get<RecurringExpense[]>("/recurring", {
    params: {
      status,
    },
  });

  return response.data.map((item) => ({
    ...item,
    amount: Number(item.amount),
  }));
};

export const createRecurringExpenseApi = async (
  data: CreateRecurringExpenseRequest,
): Promise<RecurringExpense> => {
  if (useGuestStore.getState().isGuest) {
    const newItem: LocalRecurringExpense = {
      id: uuidv4(),
      name: data.name.trim(),
      amount: Number(data.amount),
      currency: data.currency || "THB",
      billingCycle: data.billingCycle,
      nextBillingDate: data.nextBillingDate,
      categoryId: data.categoryId ?? null,
      assetId: data.assetId ?? null,
      status: data.status || RecurringStatus.ACTIVE,
      note: data.note ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: "pending",
    };

    await db.recurringExpenses.add(newItem);
    return mapLocalRecurringToResponse(newItem);
  }

  const response = await http.post<RecurringExpense>("/recurring", data);
  return {
    ...response.data,
    amount: Number(response.data.amount),
  };
};

export const updateRecurringExpenseApi = async (
  id: string,
  data: UpdateRecurringExpenseRequest,
): Promise<RecurringExpense> => {
  if (useGuestStore.getState().isGuest) {
    const existing = await db.recurringExpenses.get(id);
    if (!existing) {
      throw new Error(`Recurring expense with id ${id} not found`);
    }

    const updated: LocalRecurringExpense = {
      ...existing,
      ...data,
      amount: data.amount !== undefined ? Number(data.amount) : existing.amount,
      updatedAt: new Date().toISOString(),
      syncStatus: "pending",
    };

    await db.recurringExpenses.put(updated);
    return mapLocalRecurringToResponse(updated);
  }

  const response = await http.patch<RecurringExpense>(`/recurring/${id}`, data);
  return {
    ...response.data,
    amount: Number(response.data.amount),
  };
};

export const deleteRecurringExpenseApi = async (id: string): Promise<void> => {
  if (useGuestStore.getState().isGuest) {
    await db.recurringExpenses.delete(id);
    return;
  }

  await http.delete(`/recurring/${id}`);
};

export const logRecurringExpensePaymentApi = async (
  item: RecurringExpense,
  payload: {
    amount: number;
    paymentDate: string;
    assetId: string;
    categoryId?: string;
    note?: string;
    nextBillingDate?: string;
  },
) => {
  const effectiveCategoryId =
    payload.categoryId || item.categoryId || undefined;

  // 1. Create EXPENSE transaction
  const tx = await createTransactionApi(
    {
      amount: payload.amount,
      transactionDate: payload.paymentDate,
      assetId: payload.assetId,
      categoryId: effectiveCategoryId,
      note: payload.note || item.name,
    },
    "EXPENSE",
  );

  // 2. Advance next billing date using anchor day logic or explicit nextBillingDate
  const nextDate =
    payload.nextBillingDate ||
    getNextBillingDate(item.nextBillingDate, item.billingCycle);

  // 3. Update the recurring expense
  const updateData: Partial<CreateRecurringExpenseRequest> = {
    nextBillingDate: nextDate,
  };
  if (!item.categoryId && effectiveCategoryId) {
    updateData.categoryId = effectiveCategoryId;
  }
  const updatedRecurring = await updateRecurringExpenseApi(item.id, updateData);

  return { transaction: tx, updatedRecurring };
};
