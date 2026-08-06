import { ArrowRight, Loader2, Trash } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils/core.util";

interface TransactionFormActionsProps {
  isLoading: boolean;
  isSubmitting: boolean;
  isDesktopSheet: boolean;
  isEditing: boolean;
  transactionTypeLabel: string;
  saveLabel: string;
  deleteLabel: string;
  onDelete: () => void;
}

export default function TransactionFormActions({
  isLoading,
  isSubmitting,
  isDesktopSheet,
  isEditing,
  transactionTypeLabel,
  saveLabel,
  deleteLabel,
  onDelete,
}: Readonly<TransactionFormActionsProps>) {
  return (
    <section className={cn("mx-4 lg:absolute lg:inset-x-0 lg:bottom-4")}>
      {isLoading ? (
        <>
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </>
      ) : (
        <>
          <Button
            variant="unstyled"
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-base font-bold text-white shadow-lg transition-colors hover:bg-primary-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <ArrowRight size={18} />
            )}
            {saveLabel.replace("{type}", transactionTypeLabel)}
          </Button>
          {isDesktopSheet && isEditing && (
            <Button
              variant="unstyled"
              type="button"
              disabled={isSubmitting}
              onClick={onDelete}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-expense py-3 text-base font-bold text-white shadow-lg transition-colors hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash size={18} />
              {deleteLabel}
            </Button>
          )}
        </>
      )}
    </section>
  );
}
