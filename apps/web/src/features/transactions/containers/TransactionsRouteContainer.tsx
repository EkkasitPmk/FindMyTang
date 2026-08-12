import { cookies } from "next/headers";
import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import { getAssetsServer } from "@/features/assets/services/assets.server";
import { getCategoriesServer } from "@/features/category/services/category.server";
import { getTransactionServer } from "../services/transactions.server";
import TransactionMobileGuard from "../components/TransactionMobileGuard";

export default async function TransactionsRouteContainer({
  transactionId,
}: Readonly<{ transactionId?: string }>) {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token")) {
    return <TransactionMobileGuard />;
  }

  const [initialAssets, initialCategories, initialTransaction] =
    await Promise.all([
      getAssetsServer(),
      getCategoriesServer(false),
      transactionId
        ? getTransactionServer(transactionId)
        : Promise.resolve(null),
    ]);

  if (
    !initialAssets ||
    !initialCategories ||
    (transactionId && !initialTransaction)
  ) {
    throw new Error("Failed to load authenticated transaction data");
  }

  return (
    <TransactionMobileGuard
      initialAssets={initialAssets as Asset[]}
      initialCategories={initialCategories as Category[]}
      initialTransaction={initialTransaction ?? undefined}
    />
  );
}
