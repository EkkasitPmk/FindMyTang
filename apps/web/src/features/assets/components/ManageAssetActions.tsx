import { Edit2, Archive, RefreshCw, Trash2, ArrowUpCircle } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface ManageAssetActionsProps {
  isDeleted: boolean;
  isArchived: boolean;
  onEdit: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export default function ManageAssetActions({
  isDeleted,
  isArchived,
  onEdit,
  onArchive,
  onUnarchive,
  onRestore,
  onDelete,
}: Readonly<ManageAssetActionsProps>) {
  const { t } = useTranslation();

  if (isDeleted) {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          className="grow min-w-0 h-auto min-h-7 whitespace-normal text-primary border-primary hover:bg-primary/5"
          onClick={(e) => {
            e.stopPropagation();
            onRestore();
          }}
        >
          <RefreshCw size={14} className="mr-2" />
          {t("restore")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="grow min-w-0 h-auto min-h-7 whitespace-normal text-destructive border-destructive hover:bg-destructive/5"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={14} className="mr-2" />
          {t("deletePermanently")}
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="flex-1 min-w-0 h-auto min-h-7 whitespace-normal text-secondary-text hover:text-primary-text"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Edit2 size={14} className="mr-2" />
        {t("edit")}
      </Button>

      {isArchived ? (
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 min-w-0 h-auto min-h-7 whitespace-normal text-primary hover:text-primary/90 hover:bg-primary/5"
          onClick={(e) => {
            e.stopPropagation();
            onUnarchive();
          }}
        >
          <ArrowUpCircle size={14} className="mr-2" />
          {t("unarchive")}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 min-w-0 h-auto min-h-7 whitespace-normal text-highlight hover:text-highlight hover:bg-highlight-light"
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}
        >
          <Archive size={14} className="mr-2" />
          {t("archive")}
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        className="flex-1 min-w-0 h-auto min-h-7 whitespace-normal text-destructive hover:text-destructive/90 hover:bg-destructive/5"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 size={14} className="mr-2" />
        {t("delete")}
      </Button>
    </>
  );
}
