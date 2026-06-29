"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAssets } from "../hooks/assets.hook";
import { useTransactionsQuery } from "../../transactions/hooks/transaction.hook";
import EditAssetsContainer from "./EditAssetsContainer";
import AssetDetail from "../components/AssetDetail";

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

  return (
    <>
      <AssetDetail
        asset={asset}
        transactionsData={transactionsData}
        isLoading={isLoading}
        isLoadingTransactions={isLoadingTransactions}
        isAddMenuOpen={isAddMenuOpen}
        onAddMenuToggle={() => setIsAddMenuOpen((prev) => !prev)}
        onAddMenuClose={() => setIsAddMenuOpen(false)}
        onTransferClick={() =>
          router.push(`/transaction?type=TRANSFER&assetId=${asset?.id}`)
        }
        onEditClick={() => setIsEditModalOpen(true)}
        onAddTransactionClick={() =>
          router.push(`/transaction?assetId=${asset?.id}`)
        }
        onAddExpenseClick={() =>
          router.push(`/transaction?type=EXPENSE&assetId=${asset?.id}`)
        }
        onAddIncomeClick={() =>
          router.push(`/transaction?type=INCOME&assetId=${asset?.id}`)
        }
        onTransactionItemClick={(transaction) =>
          router.push(
            `/transaction?type=${transaction.type}&id=${transaction.id}&assetId=${asset?.id}`,
          )
        }
      />

      {isEditModalOpen && asset && (
        <EditAssetsContainer
          asset={asset}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}
