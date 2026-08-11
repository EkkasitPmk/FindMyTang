import { MONTHS } from "@/shared/lib/configs/date.config";

export function getTransactionDateRange(
  isSearchMode: boolean,
  effectiveYear: string,
  effectiveMonth: string,
) {
  if (isSearchMode) {
    if (effectiveYear === "All time") return { from: undefined, to: undefined };

    return {
      from: new Date(Number(effectiveYear), 0, 1).toISOString(),
      to: new Date(Number(effectiveYear), 11, 31, 23, 59, 59).toISOString(),
    };
  }

  if (effectiveYear === "Select") return { from: undefined, to: undefined };

  const year = Number(effectiveYear);
  if (effectiveMonth === "Select") {
    return {
      from: new Date(year, 0, 1).toISOString(),
      to: new Date(year, 11, 31, 23, 59, 59).toISOString(),
    };
  }

  const monthIndex = MONTHS.indexOf(effectiveMonth as (typeof MONTHS)[number]);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return {
    from: new Date(year, monthIndex, 1).toISOString(),
    to: new Date(year, monthIndex, lastDay, 23, 59, 59).toISOString(),
  };
}

export function shouldShowAssetLoading(
  isAssetsPending: boolean,
  isGuest: boolean,
  hasInitialAssets: boolean,
  includeDeleted: boolean,
  initialIncludeDeleted: boolean | undefined,
) {
  return (
    isAssetsPending &&
    (isGuest || !hasInitialAssets || includeDeleted !== initialIncludeDeleted)
  );
}

export function shouldFetchTransactions(
  isSearchMode: boolean,
  debouncedSearchKeyword: string,
  hasAvailableDates: boolean,
) {
  return (
    (!isSearchMode || Boolean(debouncedSearchKeyword)) && hasAvailableDates
  );
}
