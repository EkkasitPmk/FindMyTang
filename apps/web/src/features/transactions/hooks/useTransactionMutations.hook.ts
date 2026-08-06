import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/shared/lib/types/api.type";
import type { TranslationKey } from "@/shared/lib/configs/translations.config";
import {
  checkIsSubmitting,
  getTypeLabel,
  parseErrorMessage,
} from "../helpers/transaction.helper";
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "./transaction.hook";

interface UseTransactionMutationsParams {
  editId: string | null;
  t: (key: TranslationKey) => string;
  onSuccess: (message: string, shouldRedirect?: boolean) => void;
  onError: (message: string) => void;
}

export function useTransactionMutations({
  editId,
  t,
  onSuccess,
  onError,
}: UseTransactionMutationsParams) {
  const handleError = (error: AxiosError<ApiErrorResponse>, fallback: string) =>
    onError(parseErrorMessage(error, fallback));

  const createTransaction = useCreateTransactionMutation({
    onSuccess: (_, variables) => {
      const typeLabel = getTypeLabel(variables.type, t);
      onSuccess(t("transactionSavedSuccess").replace("{type}", typeLabel));
    },
    onError: (error) => handleError(error, "Failed to save transaction"),
  });

  const updateTransaction = useUpdateTransactionMutation({
    onSuccess: () => onSuccess(t("transactionUpdatedSuccess"), !!editId),
    onError: (error) => handleError(error, "Failed to update transaction"),
  });

  const deleteTransaction = useDeleteTransactionMutation({
    onSuccess: () => onSuccess(t("transactionDeletedSuccess"), true),
    onError: (error) => handleError(error, "Failed to delete transaction"),
  });

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isSubmitting: checkIsSubmitting(
      createTransaction.isPending,
      updateTransaction.isPending,
      deleteTransaction.isPending,
    ),
  };
}
