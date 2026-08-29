import { Edit2, Archive, RefreshCw, Trash2, ArrowUpCircle } from "lucide-react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import AssetActionButton from "./AssetActionButton";

interface ManageAssetActionsProps {
  isDeleted: boolean;
  isArchived: boolean;
  onEdit: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  compact?: boolean;
}

export default function ManageAssetActions({
  isDeleted,
  isArchived,
  onEdit,
  onArchive,
  onUnarchive,
  onRestore,
  onDelete,
  compact = false,
}: Readonly<ManageAssetActionsProps>) {
  const { t } = useTranslation();

  if (isDeleted) {
    return (
      <>
        <AssetActionButton
          compact={compact}
          label={t("restore")}
          icon={RefreshCw}
          onClick={onRestore}
          variant="outline"
          className="text-primary border-primary hover:bg-primary/5"
          expandedClassName="grow min-w-0 h-auto min-h-7 whitespace-normal"
        />
        <AssetActionButton
          compact={compact}
          label={t("deletePermanently")}
          icon={Trash2}
          onClick={onDelete}
          variant="outline"
          className="text-destructive border-destructive hover:bg-destructive/5"
          expandedClassName="grow min-w-0 h-auto min-h-7 whitespace-normal"
        />
      </>
    );
  }

  const archiveAction = isArchived
    ? {
        label: t("unarchive"),
        icon: ArrowUpCircle,
        onClick: onUnarchive,
        className: "text-primary hover:text-primary/90 hover:bg-primary/5",
      }
    : {
        label: t("archive"),
        icon: Archive,
        onClick: onArchive,
        className:
          "text-highlight hover:text-highlight hover:bg-highlight-light",
      };

  return (
    <>
      {(!isArchived || !compact) && (
        <AssetActionButton
          compact={compact}
          label={t("edit")}
          icon={Edit2}
          onClick={onEdit}
          variant="ghost"
          className="text-secondary-text hover:text-primary-text"
          expandedClassName="flex-1 min-w-0 h-auto min-h-7 whitespace-normal"
        />
      )}
      <AssetActionButton
        compact={compact}
        {...archiveAction}
        variant="ghost"
        expandedClassName="flex-1 min-w-0 h-auto min-h-7 whitespace-normal"
      />
      <AssetActionButton
        compact={compact}
        label={t("delete")}
        icon={Trash2}
        onClick={onDelete}
        variant="ghost"
        className="text-destructive hover:text-destructive/90 hover:bg-destructive/5"
        expandedClassName="flex-1 min-w-0 h-auto min-h-7 whitespace-normal"
      />
    </>
  );
}
