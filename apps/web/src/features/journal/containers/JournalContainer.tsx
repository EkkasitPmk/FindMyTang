"use client";
import { useState, useMemo, useRef } from "react";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from "@/shared/components/animate-ui/components/animate/tabs";
import { Input } from "@/shared/components/customs/Input";
import { Search, X, ArrowUpDown, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import MenuItem from "@/shared/components/customs/MenuItem";
import MenuCheckboxItem from "@/shared/components/customs/MenuCheckboxItem";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside.hook";
import { useInfiniteTransactionsQuery } from "@/features/transactions/hooks/transaction.hook";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { Button } from "@/shared/components/customs/Button";
import JournalCalendarContainer from "./JournalCalendarContainer";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import {
  JOURNAL_TRANSACTION_TYPES,
  JournalTransactionType,
} from "../configs/journal.config";

type ViewMode = "timeline" | "calendar";

export default function JournalContainer() {
  const { t, locale } = useTranslation();
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

    // Flatten all pages, deduplicate by id in case page boundaries overlap
    const seen = new Set<string>();
    let filteredItems = transactionsData.pages
      .flatMap((page) => page.items)
      .filter((tx) => {
        if (seen.has(tx.id)) return false;
        seen.add(tx.id);
        return true;
      });

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
      const dateStr = Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);

      if (!groupsMap.has(dateStr)) {
        groupsMap.set(dateStr, []);
      }
      groupsMap.get(dateStr)!.push(tx);
    });

    return Array.from(groupsMap.entries()).map(([dateStr, items]) => ({
      dateStr,
      items,
    }));
  }, [transactionsData, searchKeyword, locale]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background space-y-2">
      <Tabs
        value={viewMode}
        onValueChange={(val) => setViewMode(val as ViewMode)}
        className="flex-1 flex flex-col min-h-0 gap-1"
      >
        {/* 1. ใส่ Timeline สลับ Calendar */}
        <div className="px-4 shrink-0 pt-1 pb-1 bg-background z-10">
          <TabsList className="w-full">
            <TabsTrigger value="timeline">{t("timeline")}</TabsTrigger>
            <TabsTrigger value="calendar">{t("calendar")}</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0">
          <TabsContents className="h-full">
            <TabsContent value="timeline" className="h-full">
              <div className="flex flex-col h-full space-y-4">
                {/* ส่วนแสดงผล timeline */}
                <section className="px-4 space-y-4 shrink-0 bg-background z-10">
                  {/* 2. แสดง ui input search transactions */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-secondary-text/60" />
                    </div>
                    <Input
                      type="text"
                      placeholder={t("searchTransactions")}
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-10 pr-10 h-10 text-sm"
                    />
                    {searchKeyword.length > 0 && (
                      <Button
                        variant="unstyled"
                        type="button"
                        onClick={() => setSearchKeyword("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-text/60 hover:text-primary transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                              : "bg-surface border border-border text-secondary-text hover:bg-surface-secondary",
                          )}
                        >
                          {type.value === "all"
                            ? t("all")
                            : t(type.value as TranslationKey)}
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
                        className="p-1.5 bg-surface border border-border rounded-md text-secondary-text hover:bg-surface-secondary"
                      >
                        <ArrowUpDown size={18} />
                      </Button>

                      {isSortOpen && (
                        <div className="absolute right-0 top-full mt-1 flex flex-col items-start w-44 bg-surface rounded-md py-1 shadow-md z-50 border border-border">
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
                              <span className="text-sm">{t("date")}</span>
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
                              <div className="absolute top-full right-0 w-full bg-surface flex flex-col py-1 shadow-md rounded-md z-50 border border-border">
                                <MenuCheckboxItem
                                  label={t("newestFirst")}
                                  labelSize="sm"
                                  isSelected={sortType === "DATE_NEWEST"}
                                  onClick={() => {
                                    setSortType("DATE_NEWEST");
                                    setIsSortOpen(false);
                                  }}
                                />
                                <MenuCheckboxItem
                                  label={t("oldestFirst")}
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
                              <span className="text-sm">{t("amountStr")}</span>
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
                              <div className="absolute top-full right-0 w-full bg-surface flex flex-col py-1 shadow-md rounded-md z-50 border border-border">
                                <MenuCheckboxItem
                                  label={t("highestAmount")}
                                  labelSize="sm"
                                  isSelected={sortType === "AMOUNT_HIGHEST"}
                                  onClick={() => {
                                    setSortType("AMOUNT_HIGHEST");
                                    setIsSortOpen(false);
                                  }}
                                />
                                <MenuCheckboxItem
                                  label={t("lowestAmount")}
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
                <div className="flex-1 min-h-0">
                  <TransactionListContainer
                    groupedTransactions={groupedTransactions}
                    isLoadingTransactions={isLoadingTransactions}
                    isFetchingNextPage={isFetchingNextPage}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isSearchMode={searchKeyword.length > 0}
                    searchKeyword={searchKeyword}
                    page="journal"
                    useVirtualization={true}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="calendar" className="h-full flex flex-col">
              <JournalCalendarContainer />
            </TabsContent>
          </TabsContents>
        </div>
      </Tabs>
    </div>
  );
}
