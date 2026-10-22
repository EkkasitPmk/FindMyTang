import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import {
  RecurringExpense,
  RecurringStatus,
  CreateRecurringExpenseRequest,
  UpdateRecurringExpenseRequest,
} from "@/shared/lib/types/recurring.type";
import {
  getRecurringExpensesApi,
  createRecurringExpenseApi,
  updateRecurringExpenseApi,
  deleteRecurringExpenseApi,
  logRecurringExpensePaymentApi,
} from "../services/recurring.service";

export const useRecurringExpensesQuery = (
  status?: RecurringStatus,
  options?: { initialData?: RecurringExpense[] },
) => {
  const isGuest = useGuestStore((state) => state.isGuest);

  return useQuery<RecurringExpense[], Error>({
    queryKey: ["recurring", { isGuest, status }],
    queryFn: () => getRecurringExpensesApi(status),
    initialData: isGuest ? undefined : options?.initialData,
  });
};

export const useCreateRecurringExpenseMutation = (options?: {
  onSuccess?: (data: RecurringExpense) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecurringExpenseRequest) =>
      createRecurringExpenseApi(data),
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["recurring"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useUpdateRecurringExpenseMutation = (options?: {
  onSuccess?: (data: RecurringExpense) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRecurringExpenseRequest;
    }) => updateRecurringExpenseApi(id, data),
    ...options,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["recurring"] });
      options?.onSuccess?.(data);
    },
  });
};

export const useDeleteRecurringExpenseMutation = (options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecurringExpenseApi(id),
    ...options,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recurring"] });
      options?.onSuccess?.();
    },
  });
};

export const useLogRecurringExpenseMutation = (options?: {
  onSuccess?: (data: { updatedRecurring: RecurringExpense }) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      item,
      payload,
    }: {
      item: RecurringExpense;
      payload: {
        amount: number;
        paymentDate: string;
        assetId: string;
        categoryId?: string;
        note?: string;
      };
    }) => logRecurringExpensePaymentApi(item, payload),
    ...options,
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ["recurring"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      void queryClient.invalidateQueries({ queryKey: ["assets"] });
      void queryClient.invalidateQueries({ queryKey: ["analytics"] });
      void queryClient.invalidateQueries({ queryKey: ["summary"] });
      options?.onSuccess?.(result);
    },
  });
};
