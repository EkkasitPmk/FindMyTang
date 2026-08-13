"use client";
import { useEffect } from "react";
import TransactionsContainer from "../containers/TransactionsContainer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/animate-ui/components/radix/sheet";
import { useTransactionSheetStore } from "../hooks/transaction-sheet.hook";

export default function TransactionSheet() {
  const isOpen = useTransactionSheetStore((state) => state.isOpen);
  const transaction = useTransactionSheetStore((state) => state.transaction);
  const close = useTransactionSheetStore((state) => state.close);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      if (!mediaQuery.matches) close();
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [close]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="hidden lg:flex border-border"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Transactions</SheetTitle>
          <SheetDescription>Create or edit a transaction.</SheetDescription>
        </SheetHeader>
        <div className="relative min-h-0 flex-1 overflow-y-auto p-4">
          <TransactionsContainer
            isDesktopSheet
            desktopTransaction={transaction}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
