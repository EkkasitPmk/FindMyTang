import {
  AlertCircle,
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";

interface SyncStatusButtonProps {
  isGuest: boolean;
  isSyncing: boolean;
  syncStatus: "idle" | "synced" | "syncing" | "failed";
  lastSyncedAt?: string | null;
  onSyncClick?: () => void;
}

export default function SyncStatusButton({
  isGuest,
  isSyncing,
  syncStatus,
  lastSyncedAt,
  onSyncClick,
}: Readonly<SyncStatusButtonProps>) {
  const { t, locale } = useTranslation();

  const getIcon = () => {
    if (isGuest) return <CloudOff size={14} className="text-disabled-text" />;
    if (isSyncing)
      return <RefreshCw size={14} className="text-primary animate-spin" />;
    if (syncStatus === "failed")
      return <AlertCircle size={14} className="text-expense" />;
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
    if (isGuest) return t("localOnly");
    if (isSyncing) return t("syncing");
    if (syncStatus === "idle") return t("checkingSync");
    if (syncStatus === "synced") return t("upToDate");
    return t("cloudSyncFailed");
  };

  const getTitle = () => {
    if (isGuest || !lastSyncedAt) return getStatusText();

    const syncedDate = new Date(lastSyncedAt);
    if (Number.isNaN(syncedDate.getTime())) return getStatusText();

    return `${getStatusText()} · ${t("lastSyncedAt").replace(
      "{time}",
      syncedDate.toLocaleString(locale),
    )}`;
  };

  return (
    <Button
      variant="unstyled"
      onClick={onSyncClick}
      disabled={isSyncing}
      title={getTitle()}
      className={cn(
        "flex items-center justify-center group-data-[collapsible=icon]:justify-center gap-2 p-2 rounded-lg shrink-0 cursor-pointer hover:bg-surface-secondary/80 transition-[width,height,padding,gap,background-color,color] duration-300 ease-in-out text-sm group w-full group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:gap-0",
      )}
      aria-label={getStatusText()}
    >
      <div className="flex items-center justify-center w-6 h-6 rounded bg-surface border border-border/50 shadow-2xs shrink-0">
        {getIcon()}
      </div>
      <div className="min-w-0 max-w-40 text-left overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0">
        <span className="block truncate text-xs font-medium text-primary-text leading-tight">
          {getStatusText()}
        </span>
      </div>
    </Button>
  );
}
