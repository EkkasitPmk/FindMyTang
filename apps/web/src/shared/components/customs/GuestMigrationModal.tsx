import { CloudUpload, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-text/20 backdrop-blur-xs">
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <CloudUpload className="h-10 w-10 text-primary" />
          <h2 className="text-lg font-bold text-primary-text">
            Keep your Guest data?
          </h2>
          <p className="text-sm text-secondary-text">
            We found data saved on this device. Choose whether to merge it into
            your account or discard it.
          </p>
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
        </div>
      </div>
    </div>
  );
}
