import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/shared/lib/types/api.type";
import type { TranslationKey } from "@/shared/lib/configs/translations.config";
import { parseErrorMessage } from "../helpers/transaction.helper";
import {
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "./transaction.hook";

interface UseTransactionListMutationsParams {
  t: (key: TranslationKey) => string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function useTransactionListMutations({
  t,
  onSuccess,
  onError,
}: UseTransactionListMutationsParams) {
  const handleError = (error: AxiosError<ApiErrorResponse>, fallback: string) =>
    onError(parseErrorMessage(error, fallback));

  const restoreTransaction = useUpdateTransactionMutation({
    onSuccess: () =>
      onSuccess(
        t("transactionRestoredSuccess") || "Transaction restored successfully",
      ),
    onError: (error) => handleError(error, "Failed to restore transaction"),
  });

  const deleteTransaction = useDeleteTransactionMutation({
    onSuccess: () => onSuccess(t("transactionDeletedSuccess")),
    onError: (error) => handleError(error, "Failed to delete transaction"),
  });

  return { restoreTransaction, deleteTransaction };
}
