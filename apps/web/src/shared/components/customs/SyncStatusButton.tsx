import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";

interface SyncStatusButtonProps {
  isGuest: boolean;
  isSyncing: boolean;
  syncStatus: "synced" | "syncing" | "offline";
  onSyncClick?: () => void;
}

export default function SyncStatusButton({
  isGuest,
  isSyncing,
  syncStatus,
  onSyncClick,
}: Readonly<SyncStatusButtonProps>) {
  const { t } = useTranslation();

  const getIcon = () => {
    if (isGuest) return <CloudOff size={14} className="text-disabled-text" />;
    if (isSyncing)
      return <RefreshCw size={14} className="text-primary animate-spin" />;
    if (syncStatus === "synced")
      return <CheckCircle2 size={14} className="text-income" />;
    return (
      <Cloud
        size={14}
        className="text-secondary-text group-hover:text-primary"
      />
    );
  };

  const getStatusText = () => {
    if (isSyncing) return t("syncing");
    if (syncStatus === "synced") return t("upToDate");
  };

  return (
    <Button
      variant="unstyled"
      onClick={onSyncClick}
      title={isGuest ? t("localStorageLabel") : t("cloudSync")}
      className={cn(
        "flex items-center justify-center group-data-[collapsible=icon]:justify-center gap-2 p-2 rounded-lg shrink-0 cursor-pointer hover:bg-surface-secondary/80 transition-all text-sm group w-full",
      )}
      aria-label="Sync status"
    >
      <div className="flex items-center justify-center w-6 h-6 rounded bg-surface border border-border/50 shadow-2xs shrink-0">
        {getIcon()}
      </div>
      <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden overflow-hidden">
        <span className="text-xs font-medium text-primary-text leading-tight truncate">
          {isGuest ? t("localStorageLabel") : t("cloudSync")}
        </span>
        <span className="text-[10px] text-secondary-text leading-tight truncate">
          {getStatusText()}
        </span>
      </div>
    </Button>
  );
}
