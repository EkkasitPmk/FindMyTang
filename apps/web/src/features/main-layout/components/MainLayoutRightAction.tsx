import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { X, Plus } from "lucide-react";
import { useRecurringSheetStore } from "@/features/recurring/hooks/recurring-sheet.hook";
import { MainLayoutRightActionProps } from "../types/main-layout.type";

export default function MainLayoutRightAction({
  route,
  isEditingList,
  onToggleEditingList,
  onBack,
  hasAssets,
  isEditingAssets,
  onToggleEditingAssets,
  onOpenCreateAssetModal,
  assetMenu,
  t,
}: Readonly<MainLayoutRightActionProps>) {
  if (route === "categories") {
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

  if (route === "settings") {
    return (
      <Button
        variant="unstyled"
        type="button"
        onClick={onBack}
        className="p-1 mr-2 cursor-pointer flex md:hidden"
      >
        <X size={24} />
      </Button>
    );
  }

  if (route === "assets") {
    if (assetMenu) return assetMenu;

    return (
      <div className="flex items-center gap-2 mr-3">
        {!isEditingAssets && (
          <Button
            variant="unstyled"
            type="button"
            onClick={onOpenCreateAssetModal}
            className="flex items-center justify-center p-1 text-primary hover:text-primary-dark cursor-pointer transition-colors"
            aria-label={t("addAsset")}
          >
            <Plus size={20} />
          </Button>
        )}
        {hasAssets && (
          <Button
            variant="unstyled"
            type="button"
            onClick={onToggleEditingAssets}
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer"
          >
            {isEditingAssets ? t("done") : t("edit")}
          </Button>
        )}
      </div>
    );
  }

  if (route === "recurring") {
    return (
      <Button
        type="button"
        size="sm"
        onClick={() => useRecurringSheetStore.getState().open()}
        className="mr-2 rounded-xl"
        leftIcon={<Plus className="size-3.5" />}
      >
        {t("recurringAddBtn")}
      </Button>
    );
  }

  return null;
}
