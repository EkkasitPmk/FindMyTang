import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface ManageAssetDetailsProps {
  name: string;
  titleClass: string;
  isInactive: boolean;
  isDeleted: boolean;
  includeInSnapshot?: boolean;
}

export default function ManageAssetDetails({
  name,
  titleClass,
  isInactive,
  isDeleted,
  includeInSnapshot,
}: Readonly<ManageAssetDetailsProps>) {
  const { t } = useTranslation();

  return (
    <motion.div layout className="flex flex-col items-start min-w-0">
      <div className="flex items-center gap-x-1.5 flex-wrap min-w-0">
        <span className={cn("text-base font-semibold truncate", titleClass)}>
          {name}
        </span>
        {includeInSnapshot === false && !isInactive && (
          <span className="shrink-0 text-[0.625rem] text-secondary-text font-medium bg-surface-secondary border border-border/60 px-1.5 py-0.5 rounded">
            {t("excludedFromSnapshotBadge")}
          </span>
        )}
      </div>
      {isInactive && (
        <span className="text-[0.6875rem] text-secondary-text font-medium">
          {isDeleted ? t("deleted") : t("archived")}
        </span>
      )}
    </motion.div>
  );
}
