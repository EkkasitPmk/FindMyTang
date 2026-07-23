import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Button } from "@/shared/components/customs/Button";

interface SyncStatusButtonProps {
  isGuest: boolean;
  isSyncing: boolean;
  syncStatus: "synced" | "syncing" | "offline";
  onSyncClick?: () => void;
  isCollapsed?: boolean;
}

export default function SyncStatusButton({
  isGuest,
  isSyncing,
  syncStatus,
  onSyncClick,
  isCollapsed = false,
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

  if (isCollapsed) {
    return (
      <Button
        variant="unstyled"
        onClick={onSyncClick}
        title={isGuest ? t("localStorageLabel") : t("cloudSync")}
        className="flex items-center justify-center mx-auto p-2 rounded-lg shrink-0 cursor-pointer hover:bg-surface-secondary/80 transition-all text-sm group"
        aria-label="Sync status"
      >
        <div className="flex items-center justify-center w-6 h-6 rounded bg-surface border border-border/50 shadow-2xs">
          {getIcon()}
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="unstyled"
      onClick={onSyncClick}
      className="flex items-center justify-center gap-2 p-2 rounded-lg shrink-0 cursor-pointer hover:bg-surface-secondary/80 transition-all text-sm group"
      aria-label="Sync status"
    >
      <div className="flex items-center justify-center w-6 h-6 rounded bg-surface">
        {getIcon()}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-primary-text leading-tight">
          {isGuest ? t("localStorageLabel") : t("cloudSync")}
        </span>
        <span className="text-[10px] text-secondary-text leading-tight">
          {getStatusText()}
        </span>
      </div>
    </Button>
  );
}
