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
  type?: TransactionType;
}

export interface CategoryHeaderTitleProps {
  category: HeaderCategoryItem | null;
}

export interface MainLayoutTitleProps {
  route: MainLayoutRoute;
  assetName?: string;
  currentCategory: HeaderCategoryItem | null;
  t: (key: TranslationKey) => string;
}

export interface MainLayoutRightActionProps {
  route: MainLayoutRoute;
  isEditingList: boolean;
  onToggleEditingList: () => void;
  onBack: () => void;
  hasAssets: boolean;
  isEditingAssets: boolean;
  onToggleEditingAssets: () => void;
  onOpenCreateAssetModal: () => void;
  assetMenu?: React.ReactNode;
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

export type MainLayoutRoute =
  | "home"
  | "journal"
  | "analytics"
  | "transaction"
  | "categories"
  | "assets"
  | "assetsNew"
  | "settings"
  | "settingsAccount"
  | "analyticsCategory"
  | "other";
