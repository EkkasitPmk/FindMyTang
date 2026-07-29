import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import AssetsMenuContainer from "@/features/assets/containers/AssetsMenuContainer";
import { TranslationKey } from "@/shared/lib/configs/translations.config";
import { X, Plus } from "lucide-react";

interface MainLayoutRightActionProps {
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

export default function MainLayoutRightAction({
  pathname,
  isEditingList,
  onToggleEditingList,
  onBack,
  isAssetTitleMatch,
  hasAssets,
  isEditingAssets,
  onToggleEditingAssets,
  onOpenCreateAssetModal,
  t,
}: Readonly<MainLayoutRightActionProps>) {
  if (pathname === "/categories") {
    return (
      <Button
        variant="unstyled"
        type="button"
        onClick={onToggleEditingList}
        className="text-sm mr-5 text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
      >
        {isEditingList ? t("done") : t("edit")}
      </Button>
    );
  }

  if (pathname === "/settings") {
    return (
      <Button
        variant="unstyled"
        type="button"
        onClick={onBack}
        className="p-1 mr-1 cursor-pointer"
      >
        <X size={24} />
      </Button>
    );
  }

  if (pathname === "/assets") {
    if (isAssetTitleMatch) {
      return <AssetsMenuContainer />;
    }

    if (!hasAssets) {
      return (
        <Button
          variant="unstyled"
          type="button"
          onClick={onOpenCreateAssetModal}
          className="p-1 mr-2 text-primary hover:text-primary-dark cursor-pointer"
        >
          <Plus size={20} />
        </Button>
      );
    }

    return (
      <Button
        variant="unstyled"
        type="button"
        onClick={onToggleEditingAssets}
        className="text-sm mr-4 text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
      >
        {isEditingAssets ? t("done") : t("edit")}
      </Button>
    );
  }

  return null;
}
