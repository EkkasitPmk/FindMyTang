import type { UseFormSetValue } from "react-hook-form";
import { useMemo } from "react";
import { useCategories } from "@/shared/lib/hooks/useCategories.hook";
import { useAssets } from "@/shared/lib/hooks/useAssets.hook";
import type { TransactionType } from "@/shared/lib/types/transaction.type";
import type { CreateTransactionFormValues } from "../schemas/transaction.form.schema";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import {
  checkIsLoading,
  getActiveItemId,
  getRecentAssetIds,
  sortAssetsByRecent,
} from "../helpers/transaction.helper";
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

  const targetCategoryType =
    transactionType === "TRANSFER" ? "EXPENSE" : (transactionType as string);
  const filteredCategories = useMemo(
    () =>
      categories?.filter(
        (category) =>
          category.type === targetCategoryType &&
          (!category.deletedAt || category.id === watchCategoryId),
      ) || [],
    [categories, targetCategoryType, watchCategoryId],
  );
  const safeAssets = useMemo(() => {
    const raw = assets ?? [];
    return sortAssetsByRecent(raw, getRecentAssetIds());
  }, [assets]);

  const activeCategoryId = useMemo(() => {
    if (transactionType === "TRANSFER") {
      return filteredCategories.some((c) => c.id === watchCategoryId)
        ? (watchCategoryId ?? null)
        : null;
    }
    return getActiveItemId(watchCategoryId, filteredCategories);
  }, [transactionType, watchCategoryId, filteredCategories]);
  const activeAssetId = getActiveItemId(watchAssetId, safeAssets);
  const availableToAssets = useMemo(
    () => safeAssets.filter((asset) => asset.id !== activeAssetId),
    [safeAssets, activeAssetId],
  );
  const activeAssetToId = useMemo(() => {
    if (watchToAssetId === "EXTERNAL") return "EXTERNAL";
    if (
      watchToAssetId &&
      availableToAssets.some((a) => a.id === watchToAssetId)
    ) {
      return watchToAssetId;
    }
    if (availableToAssets.length > 0) {
      return availableToAssets[0].id;
    }
    return "EXTERNAL";
  }, [watchToAssetId, availableToAssets]);

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
