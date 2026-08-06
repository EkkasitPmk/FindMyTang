"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TransactionsContainer from "@/features/transactions/containers/TransactionsContainer";

export default function TransactionMobileGuard() {
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

  return <TransactionsContainer />;
}
