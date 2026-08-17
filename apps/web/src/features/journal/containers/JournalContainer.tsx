"use client";
import { useState, useMemo, useEffect } from "react";
import { TransactionListContainer } from "@/features/transactions/containers/TransactionListContainer";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from "@/shared/components/animate-ui/components/animate/tabs";
import { Input } from "@/shared/components/customs/Input";
import { Search, X, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "@/shared/components/animate-ui/components/radix/dropdown-menu";
import { useInfiniteTransactionsQuery } from "@/features/transactions/hooks/transaction.hook";
import { TransactionResponse } from "@/shared/lib/types/transaction.type";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import JournalCalendarContainer from "./JournalCalendarContainer";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import {
  JOURNAL_TRANSACTION_TYPES,
  JournalTransactionType,
} from "../configs/journal.config";
import type { PaginatedTransactionResponse } from "@/shared/lib/types/transaction.type";

type ViewMode = "timeline" | "calendar";

export default function JournalContainer({
  initialTransactions,
}: Readonly<{ initialTransactions?: PaginatedTransactionResponse }>) {
  const { t, locale } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [selectedType, setSelectedType] =
    useState<JournalTransactionType>("all");
  const [sortType, setSortType] = useState<
    "DATE_NEWEST" | "DATE_OLDEST" | "AMOUNT_HIGHEST" | "AMOUNT_LOWEST"
  >("DATE_NEWEST");
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const keyword = searchKeyword.trim();
    const timeoutId = window.setTimeout(
      () => setDebouncedSearchKeyword(keyword),
      keyword ? 300 : 0,
    );

    return () => window.clearTimeout(timeoutId);
  }, [searchKeyword]);

  const handleViewModeChange = (value: string) => {
    setViewMode(value as ViewMode);
    window.dispatchEvent(new Event("bottomnav:show"));
  };

  const isDeleted = selectedType === "deleted";
  const queryType =
    selectedType === "all" || isDeleted
      ? undefined
      : selectedType.toUpperCase();
  const canUseInitialTransactions =
    selectedType === "all" &&
    sortType === "DATE_NEWEST" &&
    debouncedSearchKeyword === "";
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteTransactionsQuery(
    {
      limit: 30,
      pagination:
        debouncedSearchKeyword || !sortType.startsWith("DATE")
          ? "page"
          : "cursor",
      type: queryType,
      isDeleted,
      sortType,
      searchKeyword: debouncedSearchKeyword || undefined,
    },
    {
      initialData: canUseInitialTransactions ? initialTransactions : undefined,
      maxPages: 3,
    },
  );

  const groupedTransactions = useMemo(() => {
    if (!transactionsData?.pages) return [];

    const seen = new Set<string>();
    const filteredItems = transactionsData.pages
      .flatMap((page) => page.items)
      .filter((tx) => {
        if (seen.has(tx.id)) return false;
        seen.add(tx.id);
        return true;
      });

    const groupsMap = new Map<string, TransactionResponse[]>();
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    filteredItems.forEach((tx) => {
      const date = new Date(tx.transactionDate);
      const dateStr = dateFormatter.format(date);

      if (!groupsMap.has(dateStr)) {
        groupsMap.set(dateStr, []);
      }
      groupsMap.get(dateStr)!.push(tx);
    });

    return Array.from(groupsMap.entries()).map(([dateStr, items]) => ({
      dateStr,
      items,
    }));
  }, [transactionsData, locale]);

  return (
    <div className="flex h-full flex-col bg-background space-y-2">
      <Tabs
        value={viewMode}
        onValueChange={handleViewModeChange}
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
                      className="pl-10 pr-10 h-10 text-sm focus:ring-0"
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
                    <div className="flex-1 flex overflow-x-auto gap-2">
                      {JOURNAL_TRANSACTION_TYPES.map((type) => {
                        let typeLabel = t(type.value as TranslationKey);
                        if (type.value === "all") typeLabel = t("all");
                        if (type.value === "deleted") {
                          typeLabel = t("deletedItems");
                        }

                        return (
                          <div
                            key={type.value}
                            className="flex shrink-0 items-center gap-2"
                          >
                            {type.value === "deleted" && (
                              <span
                                className="text-secondary-text"
                                aria-hidden="true"
                              >
                                |
                              </span>
                            )}
                            <Button
                              variant={"unstyled"}
                              onClick={() => setSelectedType(type.value)}
                              className={cn(
                                "shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
                                selectedType === type.value
                                  ? type.activeColorClass
                                  : "bg-surface border border-border text-secondary-text hover:bg-surface-secondary",
                              )}
                            >
                              {typeLabel}
                            </Button>
                          </div>
                        );
                      })}
                    </div>

                    <DropdownMenu
                      open={isSortOpen}
                      onOpenChange={setIsSortOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="unstyled"
                          hoverScale={1}
                          tapScale={1}
                          type="button"
                          className="p-1.5 bg-surface border border-border rounded-md text-secondary-text hover:bg-surface-secondary cursor-pointer outline-none"
                        >
                          <ArrowUpDown size={18} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        sideOffset={4}
                        className="w-44 p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text z-50"
                      >
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer text-sm py-2">
                            <span>{t("date")}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-40 p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text">
                            <DropdownMenuCheckboxItem
                              checked={sortType === "DATE_NEWEST"}
                              onSelect={() => {
                                setSortType("DATE_NEWEST");
                                setIsSortOpen(false);
                              }}
                              className="cursor-pointer text-sm"
                            >
                              {t("newestFirst")}
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                              checked={sortType === "DATE_OLDEST"}
                              onSelect={() => {
                                setSortType("DATE_OLDEST");
                                setIsSortOpen(false);
                              }}
                              className="cursor-pointer text-sm"
                            >
                              {t("oldestFirst")}
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="cursor-pointer text-sm py-2">
                            <span>{t("amountStr")}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="w-40 p-1 rounded-xl shadow-lg border border-border bg-surface text-primary-text">
                            <DropdownMenuCheckboxItem
                              checked={sortType === "AMOUNT_HIGHEST"}
                              onSelect={() => {
                                setSortType("AMOUNT_HIGHEST");
                                setIsSortOpen(false);
                              }}
                              className="cursor-pointer text-sm"
                            >
                              {t("highestAmount")}
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                              checked={sortType === "AMOUNT_LOWEST"}
                              onSelect={() => {
                                setSortType("AMOUNT_LOWEST");
                                setIsSortOpen(false);
                              }}
                              className="cursor-pointer text-sm"
                            >
                              {t("lowestAmount")}
                            </DropdownMenuCheckboxItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </section>

                {/* 4. Animated list with cursor pagination and end-of-list loading */}
                <div className="flex-1 min-h-0">
                  <TransactionListContainer
                    groupedTransactions={groupedTransactions}
                    isLoadingTransactions={
                      !transactionsData && isLoadingTransactions
                    }
                    isFetchingNextPage={isFetchingNextPage}
                    isFetchingPreviousPage={isFetchingPreviousPage}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    fetchNextPage={fetchNextPage}
                    fetchPreviousPage={fetchPreviousPage}
                    isSearchMode={searchKeyword.length > 0}
                    searchKeyword={searchKeyword}
                    page="journal"
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
