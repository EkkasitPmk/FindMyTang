import { Landmark, Link2 } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface EmptyAssetListProps {
  onAddAsset?: () => void;
}

export const EmptyAssetList = ({ onAddAsset }: EmptyAssetListProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-surface flex flex-col items-center gap-3 py-8 rounded-md border-2 border-border border-dashed">
      <div className="flex items-center">
        <span className="bg-surface-secondary p-4 rounded-full">
          <Landmark className="text-secondary-text" size={24} />
        </span>
      </div>
      <span className="text-base font-normal text-secondary-text">
        {t("noAssetsLinked")}
      </span>
      {onAddAsset && (
        <Button
          variant="unstyled"
          type="button"
          className="flex items-center gap-2 text-primary font-medium cursor-pointer hover:underline bg-transparent border-none p-0"
          onClick={onAddAsset}
        >
          <Link2 size={18} />
          <span>{t("addAsset")}</span>
        </Button>
      )}
    </div>
  );
};
