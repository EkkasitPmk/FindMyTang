import { Edit2, Archive, RefreshCw, Trash2, ArrowUpCircle } from "lucide-react";
import { Button } from "@/shared/components/customs/Button";

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
  if (isDeleted) {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-primary border-primary hover:bg-primary/5"
          onClick={(e) => {
            e.stopPropagation();
            onRestore();
          }}
        >
          <RefreshCw size={14} className="mr-2" />
          Restore
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-error border-error hover:bg-error/5"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={14} className="mr-2" />
          Delete Permanently
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="flex-1 text-secondary-text hover:text-primary-text"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Edit2 size={14} className="mr-2" />
        Edit
      </Button>

      {isArchived ? (
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 text-primary hover:text-primary/90 hover:bg-primary/5"
          onClick={(e) => {
            e.stopPropagation();
            onUnarchive();
          }}
        >
          <ArrowUpCircle size={14} className="mr-2" />
          Unarchive
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 text-highlight hover:text-highlight hover:bg-highlight-light"
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}
        >
          <Archive size={14} className="mr-2" />
          Archive
        </Button>
      )}

      <Button
        size="sm"
        variant="ghost"
        className="flex-1 text-error hover:text-error/90 hover:bg-error/5"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 size={14} className="mr-2" />
        Delete
      </Button>
    </>
  );
}
