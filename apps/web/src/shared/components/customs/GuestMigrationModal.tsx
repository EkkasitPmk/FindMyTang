import { CloudUpload, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/animate-ui/components/radix/dialog";

interface GuestMigrationModalProps {
  isOpen: boolean;
  isPending: boolean;
  onMerge: () => void;
  onDiscard: () => void;
}

export default function GuestMigrationModal({
  isOpen,
  isPending,
  onMerge,
  onDiscard,
}: Readonly<GuestMigrationModalProps>) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-sm rounded-2xl border-border bg-surface p-6"
      >
        <DialogHeader className="flex flex-col items-center gap-2 text-center">
          <CloudUpload className="h-10 w-10 text-primary" />
          <DialogTitle className="text-lg font-bold text-primary-text">
            Keep your Guest data?
          </DialogTitle>
          <DialogDescription className="text-sm text-secondary-text text-center">
            We found data saved on this device. Choose whether to merge it into
            your account or discard it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full flex-col gap-2 pt-2">
          <Button
            variant="default"
            onClick={onMerge}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Syncing..." : "Merge data"}
          </Button>
          <Button
            variant="outline"
            onClick={onDiscard}
            disabled={isPending}
            className="w-full"
          >
            <Trash2 size={16} />
            Discard local data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
