import { ChevronLeft, Trash } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";

interface TransactionHeaderProps {
  hasAssetId: boolean;
  isEditing: boolean;
  hideActions?: boolean;
  title: string;
  deleteLabel: string;
  onBack: () => void;
  onDelete: () => void;
}

export default function TransactionHeader({
  hasAssetId,
  isEditing,
  hideActions = false,
  title,
  deleteLabel,
  onBack,
  onDelete,
}: Readonly<TransactionHeaderProps>) {
  return (
    <header
      className={cn(
        "flex items-center relative mb-2 px-4",
        hasAssetId ? "" : "mb-2 justify-center",
        isEditing ? "justify-between" : "",
      )}
    >
      {hasAssetId && !hideActions && (
        <Button
          variant="unstyled"
          type="button"
          onClick={onBack}
          aria-label="ย้อนกลับ"
          className="p-1 -ml-1 cursor-pointer hover:bg-surface-secondary transition-colors"
        >
          <ChevronLeft size={24} />
        </Button>
      )}
      <p
        className={cn(
          "text-center text-2xl font-bold truncate",
          hasAssetId && !hideActions && "absolute left-1/2 -translate-x-1/2",
          hideActions && "w-full",
        )}
      >
        {title}
      </p>
      {isEditing && !hideActions && (
        <Button
          variant="unstyled"
          type="button"
          aria-label={deleteLabel}
          className="p-1 cursor-pointer hover:bg-surface-secondary transition-colors text-expense rounded-full"
          onClick={onDelete}
        >
          <Trash size={20} />
        </Button>
      )}
    </header>
  );
}
