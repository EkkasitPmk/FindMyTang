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

  if (!cookieStore.has("access_token") && !cookieStore.has("refresh_token")) {
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

  return (
    <TransactionMobileGuard
      initialAssets={(initialAssets as Asset[]) ?? undefined}
      initialCategories={(initialCategories as Category[]) ?? undefined}
      initialTransaction={initialTransaction ?? undefined}
    />
  );
}
