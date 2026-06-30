import { ChevronRight, Pencil } from "lucide-react";
import { Asset } from "../types/assets.type";
import {
  TransactionResponse,
  GroupedTransaction,
} from "../../transactions/types/transaction.type";
import { cn } from "@/shared/lib/utils/core.util";
import { Button } from "@/shared/components/customs/Button";
import { DropdownSelect } from "@/shared/components/customs/DropdownSelect";
import { Dispatch, SetStateAction, RefObject } from "react";
import { TransactionItem } from "./TransactionItem";

interface AssetDetailProps {
  asset?: Asset;
  groupedTransactions: GroupedTransaction[];
  isLoading: boolean;
  isLoadingTransactions: boolean;
  isAddMenuOpen: boolean;
  onAddMenuToggle: () => void;
  onAddMenuClose: () => void;
  onTransferClick: () => void;
  onAdjustmentClick: () => void;
  onEditClick: () => void;
  onAddTransactionClick: () => void;
  onAddExpenseClick: () => void;
  onAddIncomeClick: () => void;
  onTransactionItemClick: (transaction: TransactionResponse) => void;
  selected: string;
  months: string[];
  handleSelect: (months: string) => void;
  years: string[];
  selectedYear: string;
  handleSelectYear: (year: string) => void;
  isMonthOpen: boolean;
  setIsMonthOpen: Dispatch<SetStateAction<boolean>>;
  isYearOpen: boolean;
  setIsYearOpen: Dispatch<SetStateAction<boolean>>;
  expandedTransactionId: string | null;
  setExpandedTransactionId: Dispatch<SetStateAction<string | null>>;
  viewOption: string;
  isViewOptionOpen: boolean;
  viewOptionRef: RefObject<HTMLDivElement | null>;
  onViewOptionToggle: () => void;
  onViewOptionSelect: (option: string) => void;
  monthRef: RefObject<HTMLDivElement | null>;
  yearRef: RefObject<HTMLDivElement | null>;
  onRestoreClick?: (transaction: TransactionResponse) => void;
  onDeleteClick?: (transaction: TransactionResponse) => void;
}

export default function AssetDetail({
  asset,
  groupedTransactions,
  isLoading,
  isLoadingTransactions,
  isAddMenuOpen,
  onAddMenuToggle,
  onAddMenuClose,
  onTransferClick,
  onAdjustmentClick,
  onEditClick,
  onAddTransactionClick,
  onAddExpenseClick,
  onAddIncomeClick,
  onTransactionItemClick,
  selected,
  months,
  handleSelect,
  years,
  selectedYear,
  handleSelectYear,
  isMonthOpen,
  setIsMonthOpen,
  isYearOpen,
  setIsYearOpen,
  expandedTransactionId,
  setExpandedTransactionId,
  viewOption,
  isViewOptionOpen,
  viewOptionRef,
  onViewOptionToggle,
  onViewOptionSelect,
  monthRef,
  yearRef,
  onRestoreClick,
  onDeleteClick,
}: Readonly<AssetDetailProps>) {
  const viewOptionsList = ["Recent Transactions", "Show deleted items"];

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100dvh-100px)] items-center justify-center">
        <p className="text-gray-500">Loading asset...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col h-[calc(100dvh-100px)] items-center justify-center">
        <p className="text-gray-500">No asset found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] space-y-4">
      <section className="relative flex flex-col items-center justify-center mt-6">
        <div
          className="px-3 py-1 rounded-full bg-opacity-10 mb-2"
          style={{ backgroundColor: `${asset.color || "#2563EB"}1A` }}
        >
          <p
            className="font-semibold text-lg tracking-widest uppercase"
            style={{ color: asset.color || undefined }}
          >
            balance
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-3xl font-bold opacity-80"
            style={{ color: asset.color || undefined }}
          >
            ฿
          </span>
          <p className="text-3xl font-extrabold tracking-tight text-gray-900">
            {asset.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </section>

      <section className="mb-2 px-4">
        <DropdownSelect
          ref={viewOptionRef}
          options={viewOptionsList}
          selected={viewOption}
          isOpen={isViewOptionOpen}
          onToggle={onViewOptionToggle}
          themeColor={asset.color}
          onSelect={onViewOptionSelect}
          className="w-full text-base font-medium"
        />

        {groupedTransactions?.length > 0 && (
          <>
            <span className="text-secondary-text text-sm">Period</span>

            <div className="flex items-center justify-between">
              <DropdownSelect
                ref={monthRef}
                options={months}
                selected={selected}
                isOpen={isMonthOpen}
                onToggle={() => setIsMonthOpen(!isMonthOpen)}
                themeColor={asset.color}
                onSelect={(month) => {
                  handleSelect(month);
                  setIsMonthOpen(false);
                }}
              />
              <DropdownSelect
                ref={yearRef}
                options={years}
                selected={selectedYear}
                isOpen={isYearOpen}
                onToggle={() => setIsYearOpen(!isYearOpen)}
                themeColor={asset.color}
                onSelect={(year) => {
                  handleSelectYear(year);
                  setIsYearOpen(false);
                }}
              />
            </div>
          </>
        )}
      </section>

      <section className="flex-1 overflow-y-auto relative">
        {isLoadingTransactions ? (
          <div className="p-4 text-center text-gray-500">
            Loading transactions...
          </div>
        ) : (
          <div className="bg-white">
            {groupedTransactions.map((group) => (
              <div key={group.dateStr} className="relative">
                <div className="sticky top-0 bg-white z-10 py-2 text-base font-medium px-4">
                  <span>{group.dateStr}</span>
                </div>
                <div className="space-y-1">
                  {group.items.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      expandedTransactionId={expandedTransactionId}
                      setExpandedTransactionId={setExpandedTransactionId}
                      onTransactionItemClick={onTransactionItemClick}
                      onRestoreClick={onRestoreClick}
                      onDeleteClick={onDeleteClick}
                    />
                  ))}
                </div>
              </div>
            ))}
            {!groupedTransactions?.length && (
              <div className="p-4 text-center text-gray-500">
                No transactions found
              </div>
            )}
          </div>
        )}
      </section>

      {/* nav action bottom */}
      <section className="fixed bottom-0 right-0 left-0 py-2 px-4 border-t border-border bg-white z-50">
        <div className="flex gap-3">
          <Button
            variant="unstyled"
            onClick={onEditClick}
            className="w-[25%] flex flex-col items-center justify-center border border-border py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <Pencil size={18} />
            <span className="text-sm mt-px">Edit</span>
          </Button>
          <div
            className={cn(
              "relative w-[75%] flex items-center bg-primary text-white text-sm font-medium rounded-md cursor-pointer",
              isAddMenuOpen ? "rounded-tl-none rounded-tr-none" : "",
            )}
            style={{ backgroundColor: asset?.color || undefined }}
          >
            <Button
              variant="unstyled"
              onClick={onAddTransactionClick}
              className={cn(
                "w-full h-full px-2 truncate rounded-md hover:bg-black/10 transition-colors",
                isAddMenuOpen
                  ? "rounded-tl-none rounded-tr-none rounded-br-none"
                  : "rounded-tr-none rounded-br-none",
              )}
            >
              Add Transaction
            </Button>

            <div className="h-full w-px bg-background" />

            <Button
              variant="unstyled"
              onClick={onAddMenuToggle}
              className={cn(
                "w-[20%] h-full rounded-md hover:bg-black/10 transition-colors flex items-center justify-center",
                isAddMenuOpen
                  ? "rounded-tr-none rounded-tl-none rounded-bl-none"
                  : "rounded-tl-none rounded-bl-none",
              )}
            >
              <ChevronRight
                size={20}
                className={cn(
                  "transition-transform",
                  isAddMenuOpen && "-rotate-90",
                )}
              />
            </Button>

            {isAddMenuOpen && (
              <>
                <Button
                  variant="unstyled"
                  type="button"
                  aria-label="Close add menu"
                  className="fixed inset-0 z-0 w-full h-full cursor-default focus:outline-none"
                  onClick={onAddMenuClose}
                  tabIndex={-1}
                />
                <div
                  className={cn(
                    "absolute w-full bottom-full py-1 left-1/2 -translate-x-1/2 z-10 border border-border rounded-md flex flex-col bg-primary text-white overflow-hidden",
                    isAddMenuOpen ? "rounded-bl-none rounded-br-none" : "",
                  )}
                  style={{ backgroundColor: asset?.color || undefined }}
                >
                  <Button
                    variant="unstyled"
                    onClick={onAddExpenseClick}
                    className="w-full py-2 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                  >
                    Expense
                  </Button>
                  <Button
                    variant="unstyled"
                    onClick={onAddIncomeClick}
                    className="w-full py-2 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                  >
                    Income
                  </Button>
                  <Button
                    variant="unstyled"
                    onClick={onTransferClick}
                    className="w-full py-2 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                  >
                    Transfer
                  </Button>
                  <Button
                    variant="unstyled"
                    onClick={onAdjustmentClick}
                    className="w-full py-2 text-sm hover:bg-black/10 font-medium"
                  >
                    Adjustment
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
