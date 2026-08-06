import type { Asset } from "@/shared/lib/types/asset.type";
import type { Category } from "@/shared/lib/types/category.type";
import type { TransactionType } from "@/shared/lib/types/transaction.type";
import TransactionAssetList from "./TransactionAssetList";
import TransactionCategoryList from "./TransactionCategoryList";

interface TransactionSelectionFieldsProps {
  showCategoryList: boolean;
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onEditCategory: () => void;
  isLoadingCategoryList: boolean;
  assets: Asset[];
  activeAssetId: string | null;
  onSelectAsset: (id: string) => void;
  activeAssetToId: string | null;
  onSelectAssetTo: (id: string) => void;
  transactionType: TransactionType;
  isLoadingAssetList: boolean;
}

export default function TransactionSelectionFields({
  showCategoryList,
  categories,
  activeCategoryId,
  onSelectCategory,
  onEditCategory,
  isLoadingCategoryList,
  assets,
  activeAssetId,
  onSelectAsset,
  activeAssetToId,
  onSelectAssetTo,
  transactionType,
  isLoadingAssetList,
}: Readonly<TransactionSelectionFieldsProps>) {
  return (
    <>
      {showCategoryList && (
        <TransactionCategoryList
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={onSelectCategory}
          onEditClick={onEditCategory}
          isLoadingCategoryList={isLoadingCategoryList}
        />
      )}
      <TransactionAssetList
        assets={assets}
        activeAssetId={activeAssetId}
        onSelectAsset={onSelectAsset}
        activeAssetToId={activeAssetToId}
        onSelectAssetTo={onSelectAssetTo}
        transactionType={transactionType}
        isLoadingAssetList={isLoadingAssetList}
      />
    </>
  );
}
