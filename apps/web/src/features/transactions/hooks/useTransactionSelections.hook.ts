import type { UseFormSetValue } from "react-hook-form";
import { useMemo } from "react";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import type { TransactionType } from "@/shared/lib/types/transaction.type";
import type { CreateTransactionFormValues } from "../schemas/transaction.form.schema";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import { checkIsLoading, getActiveItemId } from "../helpers/transaction.helper";
import { useTransactionFormSync } from "./transaction-form.hook";

interface UseTransactionSelectionsParams {
  transactionType: TransactionType;
  watchCategoryId: string | undefined;
  watchAssetId: string | undefined;
  watchToAssetId: string | undefined;
  setValue: UseFormSetValue<CreateTransactionFormValues>;
  initialAssets?: Asset[];
  initialCategories?: Category[];
}

export function useTransactionSelections({
  transactionType,
  watchCategoryId,
  watchAssetId,
  watchToAssetId,
  setValue,
  initialAssets,
  initialCategories,
}: UseTransactionSelectionsParams) {
  const {
    data: categories,
    isPending: isCategoryPending,
    isFetching: isCategoryFetching,
  } = useCategories({ initialData: initialCategories });
  const {
    data: assets,
    isPending: isAssetPending,
    isFetching: isAssetFetching,
  } = useAssets({ initialData: initialAssets });

  const filteredCategories = useMemo(
    () =>
      categories?.filter(
        (category) =>
          category.type === (transactionType as string) &&
          (!category.deletedAt || category.id === watchCategoryId),
      ) || [],
    [categories, transactionType, watchCategoryId],
  );
  const safeAssets = useMemo(() => assets ?? [], [assets]);
  const activeCategoryId = getActiveItemId(watchCategoryId, filteredCategories);
  const activeAssetId = getActiveItemId(watchAssetId, safeAssets);
  const availableToAssets = useMemo(
    () => safeAssets.filter((asset) => asset.id !== activeAssetId),
    [safeAssets, activeAssetId],
  );
  const activeAssetToId = getActiveItemId(watchToAssetId, availableToAssets);

  useTransactionFormSync({
    transactionType,
    activeCategoryId,
    watchCategoryId,
    activeAssetId,
    watchAssetId,
    activeAssetToId,
    watchToAssetId,
    setValue,
  });

  return {
    filteredCategories,
    safeAssets,
    activeCategoryId,
    activeAssetId,
    activeAssetToId,
    isLoadingCategoryList: checkIsLoading(
      isCategoryPending,
      isCategoryFetching,
    ),
    isLoadingAssetList: checkIsLoading(isAssetPending, isAssetFetching),
  };
}
