"use client";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAssets } from "../hooks/assets.hook";
import { useTransactionsQuery } from "../../transactions/hooks/transaction.hook";
import { formatDisplayDate } from "../../transactions/helpers/date.helper";
import EditAssetsContainer from "./EditAssetsContainer";
import AssetDetail from "../components/AssetDetail";
import ListAssetsContainer from "./ListAssetsContainer";

export default function AssetDetailContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const { data: assets, isLoading } = useAssets();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const asset = assets?.find((a) => a.id === id) || assets?.[0];

  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useTransactionsQuery(
      asset ? { assetId: asset.id, limit: 9999 } : undefined,
    );

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Select");
  const [selectedYear, setSelectedYear] = useState("Select");
  const [expandedTransactionId, setExpandedTransactionId] = useState<
    string | null
  >(null);

  const { months, years, groupedTransactions, effectiveYear, effectiveMonth } =
    useMemo(() => {
      if (!transactionsData?.items?.length) {
        return {
          months: [] as string[],
          years: [] as string[],
          effectiveYear: "Select",
          effectiveMonth: "Select",
          groupedTransactions: [],
          filteredTransactionsData: {
            ...transactionsData,
            items: [],
          } as typeof transactionsData,
        };
      }

      // 1. Get all available years
      const yearsSet = new Set<string>();
      transactionsData.items.forEach((tx) => {
        yearsSet.add(new Date(tx.transactionDate).getFullYear().toString());
      });
      const availableYears = Array.from(yearsSet).sort((a, b) =>
        b.localeCompare(a),
      );

      // Determine effective year to filter by
      const effectiveYear = availableYears.includes(selectedYear)
        ? selectedYear
        : availableYears[0];

      // 2. Filter transactions by effective year
      let filteredItems = transactionsData.items.filter(
        (tx) =>
          new Date(tx.transactionDate).getFullYear().toString() ===
          effectiveYear,
      );

      // 3. Get all available months for the effective year
      const monthsSet = new Set<string>();
      filteredItems.forEach((tx) => {
        monthsSet.add(
          new Date(tx.transactionDate).toLocaleString("en-US", {
            month: "long",
          }),
        );
      });

      // Sort months descending (latest month to earliest month)
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const availableMonths = Array.from(monthsSet).sort(
        (a, b) => monthNames.indexOf(b) - monthNames.indexOf(a),
      );

      // Determine effective month
      const effectiveMonth = availableMonths.includes(selectedMonth)
        ? selectedMonth
        : availableMonths[0] || "Select";

      // 4. Filter transactions by effective month
      if (effectiveMonth !== "Select") {
        filteredItems = filteredItems.filter(
          (tx) =>
            new Date(tx.transactionDate).toLocaleString("en-US", {
              month: "long",
            }) === effectiveMonth,
        );
      }

      const groupedTransactions = (() => {
        const groups: { dateStr: string; items: typeof filteredItems }[] = [];
        let currentGroup: {
          dateStr: string;
          items: typeof filteredItems;
        } | null = null;

        filteredItems.forEach((tx) => {
          const txDate = new Date(tx.transactionDate);
          const dateStr = formatDisplayDate(txDate);

          if (currentGroup?.dateStr !== dateStr) {
            currentGroup = { dateStr, items: [] as typeof filteredItems };
            groups.push(currentGroup);
          }
          currentGroup.items.push(tx);
        });
        return groups;
      })();

      return {
        months: availableMonths,
        years: availableYears,
        effectiveYear,
        effectiveMonth,
        groupedTransactions,
        filteredTransactionsData: {
          ...transactionsData,
          items: filteredItems,
        },
      };
    }, [transactionsData, selectedYear, selectedMonth]);

  const handleSelectMonth = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <>
      {id === null ? (
        <ListAssetsContainer id={id} />
      ) : (
        <>
          <AssetDetail
            asset={asset}
            groupedTransactions={groupedTransactions}
            isLoading={isLoading}
            isLoadingTransactions={isLoadingTransactions}
            isAddMenuOpen={isAddMenuOpen}
            onAddMenuToggle={() => setIsAddMenuOpen((prev) => !prev)}
            onAddMenuClose={() => setIsAddMenuOpen(false)}
            onTransferClick={() =>
              router.push(`/transaction?type=TRANSFER&assetId=${asset?.id}`)
            }
            onAdjustmentClick={() =>
              router.push(`/transaction?type=ADJUSTMENT&assetId=${asset?.id}`)
            }
            onEditClick={() => setIsEditModalOpen(true)}
            onAddTransactionClick={() =>
              router.push(`/transaction?assetId=${asset?.id}`)
            }
            onAddExpenseClick={() =>
              router.push(`/transaction?type=EXPENSE&assetId=${asset?.id}`)
            }
            onAddIncomeClick={() =>
              router.push(`/transaction?type=INCOME&assetId=${asset?.id}`)
            }
            onTransactionItemClick={(transaction) =>
              router.push(
                `/transaction?type=${transaction.type}&id=${transaction.id}&assetId=${asset?.id}`,
              )
            }
            selected={effectiveMonth}
            months={months}
            handleSelect={handleSelectMonth}
            years={years}
            selectedYear={effectiveYear}
            handleSelectYear={setSelectedYear}
            isMonthOpen={isMonthOpen}
            setIsMonthOpen={setIsMonthOpen}
            isYearOpen={isYearOpen}
            setIsYearOpen={setIsYearOpen}
            expandedTransactionId={expandedTransactionId}
            setExpandedTransactionId={setExpandedTransactionId}
          />
          {isEditModalOpen && asset && (
            <EditAssetsContainer
              asset={asset}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
}
