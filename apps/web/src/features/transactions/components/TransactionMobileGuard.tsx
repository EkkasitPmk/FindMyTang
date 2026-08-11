"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import type { TransactionResponse } from "@/shared/lib/types/transaction.type";
import TransactionsContainer from "../containers/TransactionsContainer";

export default function TransactionMobileGuard({
  initialAssets,
  initialCategories,
  initialTransaction,
}: Readonly<{
  initialAssets?: Asset[];
  initialCategories?: Category[];
  initialTransaction?: TransactionResponse;
}>) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isMobile === false) router.replace("/dashboard");
  }, [isMobile, router]);

  if (isMobile !== true) return null;

  return (
    <TransactionsContainer
      initialAssets={initialAssets}
      initialCategories={initialCategories}
      initialTransaction={initialTransaction}
    />
  );
}
