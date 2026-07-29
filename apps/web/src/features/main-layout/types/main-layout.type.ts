import { TransactionType } from "@/shared/lib/types/transaction.type";
import { TranslationKey } from "@/shared/lib/configs/translations.config";

export interface SyntheticCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type?: TransactionType;
}

export interface HeaderCategoryItem {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  type?: TransactionType | string;
}

export interface CategoryHeaderTitleProps {
  category: HeaderCategoryItem | null;
}

export interface MainLayoutTitleProps {
  pathname: string;
  assetName?: string;
  currentCategory: HeaderCategoryItem | null;
  t: (key: TranslationKey) => string;
}

export interface MainLayoutRightActionProps {
  pathname: string;
  isEditingList: boolean;
  onToggleEditingList: () => void;
  onBack: () => void;
  isAssetTitleMatch: boolean;
  hasAssets: boolean;
  isEditingAssets: boolean;
  onToggleEditingAssets: () => void;
  onOpenCreateAssetModal: () => void;
  t: (key: TranslationKey) => string;
}

export interface MainLayoutSearchBarProps {
  searchKeyword: string;
  onSearchKeywordChange: (value: string) => void;
  onCloseSearch: () => void;
  placeholder: string;
}

export interface MainContentClassNamesParams {
  isMainTab: boolean;
  shouldShowTopAppBar: boolean;
  isSearchMode: boolean;
  pathname: string;
}
