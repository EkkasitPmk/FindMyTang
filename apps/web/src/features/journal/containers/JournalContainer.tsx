"use client";
import { useState, useMemo, useRef } from "react";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import { SegmentedControl } from "@/shared/components/customs/SegmentedControl";
import { Input } from "@/shared/components/customs/Input";
import { Search, X, ArrowUpDown, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import MenuItem from "@/shared/components/customs/MenuItem";
import MenuCheckboxItem from "@/shared/components/customs/MenuCheckboxItem";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside.hook";
import { useInfiniteTransactionsQuery } from "@/features/transactions/hooks/transaction.hook";
import { TransactionResponse } from "@/features/transactions/types/transaction.type";
import { format } from "date-fns";
import { Button } from "@/shared/components/customs/Button";
import JournalCalendarContainer from "./JournalCalendarContainer";
import {
  JOURNAL_TRANSACTION_TYPES,
  JournalTransactionType,
} from "../configs/journal.config";

type ViewMode = "timeline" | "calendar";

export default function JournalContainer() {
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedType, setSelectedType] =
    useState<JournalTransactionType>("all");
  const [sortType, setSortType] = useState<
    "DATE_NEWEST" | "DATE_OLDEST" | "AMOUNT_HIGHEST" | "AMOUNT_LOWEST"
  >("DATE_NEWEST");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [openSortSubMenu, setOpenSortSubMenu] = useState<
    "DATE" | "MONEY" | null
  >(null);

  const sortMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(
    sortMenuRef,
    () => {
      setIsSortOpen(false);
      setOpenSortSubMenu(null);
    },
    isSortOpen,
  );

  const queryType =
    selectedType === "all" ? undefined : selectedType.toUpperCase();
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTransactionsQuery({
    limit: 20, // Load 20 per page
    type: queryType,
    sortType,
  });

  const groupedTransactions = useMemo(() => {
    if (!transactionsData?.pages) return [];

    // Flatten all pages into a single array of items
    let filteredItems = transactionsData.pages.flatMap((page) => page.items);

    if (searchKeyword.trim()) {
      const lowerKeyword = searchKeyword.toLowerCase();
      filteredItems = filteredItems.filter(
        (tx) =>
          tx.note?.toLowerCase().includes(lowerKeyword) ||
          tx.category?.name?.toLowerCase().includes(lowerKeyword) ||
          tx.asset?.name?.toLowerCase().includes(lowerKeyword) ||
          tx.toAsset?.name?.toLowerCase().includes(lowerKeyword) ||
          tx.amount.toString().includes(lowerKeyword) ||
          tx.type.toLowerCase().includes(lowerKeyword),
      );
    }

    const groupsMap = new Map<string, TransactionResponse[]>();

    filteredItems.forEach((tx) => {
      const date = new Date(tx.transactionDate);
      const dateStr = format(date, "dd MMM yyyy");

      if (!groupsMap.has(dateStr)) {
        groupsMap.set(dateStr, []);
      }
      groupsMap.get(dateStr)!.push(tx);
    });

    return Array.from(groupsMap.entries()).map(([dateStr, items]) => ({
      dateStr,
      items,
    }));
  }, [transactionsData, searchKeyword]);

  return (
    <div className="flex flex-col h-[calc(100vh-82px)] bg-background space-y-2">
      {/* 1. ใส่ Timeline สลับ Calendar */}
      <div className="px-4">
        <SegmentedControl<ViewMode>
          options={[
            { label: "Timeline", value: "timeline" },
            { label: "Calendar", value: "calendar" },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
      </div>

      {viewMode === "timeline" ? (
        <>
          {/* ส่วนแสดงผล timeline */}
          <section className="px-4 space-y-4">
            {/* 2. แสดง ui input search transactions */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-secondary-text/60" />
              </div>
              <Input
                type="text"
                placeholder="Search transactions..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 pr-10 h-10 text-sm"
              />
              {searchKeyword.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-text/60 hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* 3. แสดง ui tabs switch และ sort */}
            <div className="flex items-center gap-2 pb-1">
              <div className="flex-1 flex overflow-x-auto gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                {JOURNAL_TRANSACTION_TYPES.map((type) => (
                  <Button
                    variant={"unstyled"}
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={cn(
                      "flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                      selectedType === type.value
                        ? "bg-primary text-white"
                        : "bg-white border border-border text-secondary-text hover:bg-gray-50",
                    )}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>

              <div className="relative flex-none" ref={sortMenuRef}>
                <Button
                  variant="unstyled"
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    if (!isSortOpen) setOpenSortSubMenu(null);
                  }}
                  className="p-1.5 bg-white border border-border rounded-md text-secondary-text hover:bg-gray-50"
                >
                  <ArrowUpDown size={18} />
                </Button>

                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-1 flex flex-col items-start w-44 bg-white rounded-md py-1 shadow-md z-50 border border-gray-100">
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenSortSubMenu((prev) =>
                          prev === "DATE" ? null : "DATE",
                        );
                      }}
                      className="relative flex items-center justify-between w-full"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-sm">Date</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={cn(
                          "transition-transform",
                          isSortOpen && openSortSubMenu === "DATE"
                            ? "rotate-90"
                            : "",
                        )}
                      />
                      {openSortSubMenu === "DATE" && (
                        <div className="absolute top-full right-0 w-full bg-white flex flex-col py-1 shadow-md rounded-md z-50 border border-gray-100">
                          <MenuCheckboxItem
                            label="Newest First"
                            labelSize="sm"
                            isSelected={sortType === "DATE_NEWEST"}
                            onClick={() => {
                              setSortType("DATE_NEWEST");
                              setIsSortOpen(false);
                            }}
                          />
                          <MenuCheckboxItem
                            label="Oldest First"
                            labelSize="sm"
                            isSelected={sortType === "DATE_OLDEST"}
                            onClick={() => {
                              setSortType("DATE_OLDEST");
                              setIsSortOpen(false);
                            }}
                          />
                        </div>
                      )}
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenSortSubMenu((prev) =>
                          prev === "MONEY" ? null : "MONEY",
                        );
                      }}
                      className="relative flex items-center justify-between w-full"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-sm">Amount</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={cn(
                          "transition-transform",
                          isSortOpen && openSortSubMenu === "MONEY"
                            ? "rotate-90"
                            : "",
                        )}
                      />
                      {openSortSubMenu === "MONEY" && (
                        <div className="absolute top-full right-0 w-full bg-white flex flex-col py-1 shadow-md rounded-md z-50 border border-gray-100">
                          <MenuCheckboxItem
                            label="Highest Amount"
                            labelSize="sm"
                            isSelected={sortType === "AMOUNT_HIGHEST"}
                            onClick={() => {
                              setSortType("AMOUNT_HIGHEST");
                              setIsSortOpen(false);
                            }}
                          />
                          <MenuCheckboxItem
                            label="Lowest Amount"
                            labelSize="sm"
                            isSelected={sortType === "AMOUNT_LOWEST"}
                            onClick={() => {
                              setSortType("AMOUNT_LOWEST");
                              setIsSortOpen(false);
                            }}
                          />
                        </div>
                      )}
                    </MenuItem>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 4. แสดง transaction เรียงลงมาแบบปกติ และมี Lazy Load ด้วย Intersection Observer */}
          <div className="flex-1 overflow-y-auto relative">
            <TransactionListContainer
              groupedTransactions={groupedTransactions}
              isLoadingTransactions={isLoadingTransactions}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isSearchMode={searchKeyword.length > 0}
              searchKeyword={searchKeyword}
              page="journal"
            />
          </div>
        </>
      ) : (
        <JournalCalendarContainer />
      )}
    </div>
  );
}
