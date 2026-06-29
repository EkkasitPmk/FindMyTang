"use client";
import {
  ArrowRightLeft,
  ChevronRight,
  Coffee,
  Pencil,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAssets } from "../hooks/assets.hook";
import { useTransactionsQuery } from "../../transactions/hooks/transaction.hook";
import { TransactionResponse } from "../../transactions/types/transaction.type";
import EditAssetsContainer from "./EditAssetsContainer";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/customs/Button";

export default function AssetDetailContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const { data: assets, isLoading } = useAssets();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const asset = assets?.find((a) => a.id === id) || assets?.[0];

  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useTransactionsQuery(asset ? { assetId: asset.id } : undefined);

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
      <div className="flex flex-col items-center justify-center my-4">
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
                    iconElement = (
                      <span className="bg-green-200/90 rounded-full p-2">
                        <Plus size={18} className="text-green-600" />
                      </span>
                    );
                    amountColorClass = "text-green-600";
                    amountPrefix = "+";
                  } else if (isExpense) {
                    iconElement = (
                      <span className="bg-red-200/90 rounded-full p-2">
                        <Coffee size={18} className="text-red-600" />
                      </span>
                    );
                    amountColorClass = "text-red-600";
                    amountPrefix = "-";
                  } else {
                    iconElement = (
                      <span className="bg-blue-200/90 rounded-full p-2">
                        <ArrowRightLeft size={18} className="text-blue-600" />
                      </span>
                    );
                  }

                  return (
                    <div
                      key={transaction.id}
                      className={`flex items-center justify-between p-2 ${isLast ? "" : "border-b border-border"}`}
                    >
                      <div className="flex items-center gap-3">
                        {iconElement}
                        <div className="flex flex-col leading-5">
                          <span className="text-base">
                            {transaction.category?.name ||
                              transaction.note ||
                              transaction.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(
                              new Date(transaction.transactionDate),
                              "MMM dd",
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
                    </div>
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
      <div className="fixed bottom-0 right-0 left-0 py-4 px-4 border-t border-border bg-white">
        <div className="flex gap-3">
          <Button
            variant="unstyled"
            onClick={() =>
              router.push(`/transaction?type=TRANSFER&assetId=${asset?.id}`)
            }
            className="w-[25%] flex flex-col items-center justify-center border border-border py-2 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <ArrowRightLeft size={18} />
            <span className="text-sm">Transfer</span>
          </Button>
          <Button
            variant="unstyled"
            onClick={() => setIsEditModalOpen(true)}
            className="w-[25%] flex flex-col items-center justify-center border border-border py-2 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Pencil size={18} />
            <span className="text-sm">Edit</span>
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
              onClick={() => router.push(`/transaction?assetId=${asset?.id}`)}
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
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
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
                  onClick={() => setIsAddMenuOpen(false)}
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
                    onClick={() =>
                      router.push(
                        `/transaction?type=EXPENSE&assetId=${asset?.id}`,
                      )
                    }
                    className="w-full py-2 text-sm hover:bg-black/10 border-b border-border/20 font-medium"
                  >
                    Expense
                  </Button>
                  <Button
                    variant="unstyled"
                    onClick={() =>
                      router.push(
                        `/transaction?type=INCOME&assetId=${asset?.id}`,
                      )
                    }
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

      {isEditModalOpen && asset && (
        <EditAssetsContainer
          asset={asset}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
