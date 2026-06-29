import {
  ArrowRightLeft,
  ChevronRight,
  Pencil,
  SlidersHorizontal,
} from "lucide-react";
import { Asset } from "../types/assets.type";
import {
  TransactionResponse,
  PaginatedTransactionResponse,
} from "../../transactions/types/transaction.type";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/customs/Button";
import { getCategoryIcon } from "@/shared/lib/configs/category-icons.config";
import { formatDisplayDate } from "../../transactions/helpers/date.helper";

interface AssetDetailProps {
  asset?: Asset;
  transactionsData?: PaginatedTransactionResponse;
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
}

export default function AssetDetail({
  asset,
  transactionsData,
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
}: Readonly<AssetDetailProps>) {
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
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="relative flex flex-col items-center justify-center my-4">
        <Button
          variant="unstyled"
          onClick={onEditClick}
          className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          title="Edit Asset"
        >
          <Pencil size={18} />
        </Button>
        <p className="text-gray-500 font-medium">BALANCE</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-2xl font-bold">฿</span>
          <p className="text-3xl font-bold">
            {asset.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between my-2">
        <p>Recent Transactions</p>
        <ChevronRight size={18} />
      </div>

      <div className="flex-1 overflow-y-auto pb-14">
        <div className="bg-white rounded-md border border-border">
          {isLoadingTransactions ? (
            <div className="p-4 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : (
            <>
              {transactionsData?.items.map(
                (transaction: TransactionResponse, index: number) => {
                  const isIncome = transaction.type === "INCOME";
                  const isExpense = transaction.type === "EXPENSE";
                  const isLast = index === transactionsData.items.length - 1;

                  let iconElement = null;
                  let amountColorClass = "text-gray-800";
                  let amountPrefix = "";

                  if (isIncome) {
                    amountColorClass = "text-green-600";
                    amountPrefix = "+";
                  } else if (isExpense) {
                    amountColorClass = "text-red-600";
                    amountPrefix = "-";
                  }

                  if (transaction.category) {
                    const CategoryIcon = getCategoryIcon(
                      transaction.category.icon,
                      transaction.category.type,
                    );
                    iconElement = (
                      <span
                        className="bg-gray-100 rounded-full p-2"
                        style={{ color: transaction.category.color }}
                      >
                        <CategoryIcon size={18} />
                      </span>
                    );
                  } else if (transaction.type === "TRANSFER") {
                    iconElement = (
                      <span className="bg-gray-100 rounded-full p-2 text-blue-500">
                        <ArrowRightLeft size={18} />
                      </span>
                    );
                  } else if (transaction.type === "ADJUSTMENT") {
                    iconElement = (
                      <span className="bg-gray-100 rounded-full p-2 text-purple-500">
                        <SlidersHorizontal size={18} />
                      </span>
                    );
                  }

                  return (
                    <Button
                      variant="unstyled"
                      key={transaction.id}
                      type="button"
                      onClick={() => onTransactionItemClick(transaction)}
                      className={`w-full text-left flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors${isLast ? "" : "border-b border-border"}`}
                    >
                      <div className="flex items-center gap-3">
                        {iconElement}
                        <div className="flex flex-col leading-5">
                          <span className="text-base capitalize">
                            {transaction.type === "ADJUSTMENT" ||
                            transaction.type === "TRANSFER"
                              ? transaction.type.toLowerCase()
                              : transaction.category?.name ||
                                transaction.note ||
                                transaction.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDisplayDate(
                              new Date(transaction.transactionDate),
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-base ${amountColorClass}`}>
                          {amountPrefix}฿
                          {transaction.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <ChevronRight size={18} className="text-gray-400" />
                      </div>
                    </Button>
                  );
                },
              )}
              {(!transactionsData?.items ||
                transactionsData.items.length === 0) && (
                <div className="p-4 text-center text-gray-500">
                  No transactions found
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* nav action bottom */}
      <div className="fixed bottom-0 right-0 left-0 py-2 px-4 border-t border-border bg-white z-50">
        <div className="flex gap-3">
          <Button
            variant="unstyled"
            onClick={onTransferClick}
            className="w-[25%] flex flex-col items-center justify-center border border-border py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <ArrowRightLeft size={18} />
            <span className="text-sm mt-px">Transfer</span>
          </Button>
          <Button
            variant="unstyled"
            onClick={onAdjustmentClick}
            className="w-[25%] flex flex-col items-center justify-center border border-border py-1.5 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <SlidersHorizontal size={18} />
            <span className="text-sm mt-px">Adjust</span>
          </Button>
          <div
            className={cn(
              "relative w-[50%] flex items-center bg-primary text-white text-sm font-medium rounded-md cursor-pointer",
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
                    className="w-full py-2 text-sm hover:bg-black/10 font-medium"
                  >
                    Income
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
