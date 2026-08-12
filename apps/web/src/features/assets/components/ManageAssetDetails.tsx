import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils/core.util";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface ManageAssetDetailsProps {
  name: string;
  titleClass: string;
  isInactive: boolean;
  isDeleted: boolean;
}

export default function ManageAssetDetails({
  name,
  titleClass,
  isInactive,
  isDeleted,
}: Readonly<ManageAssetDetailsProps>) {
  const { t } = useTranslation();

  return (
    <motion.div layout className="flex flex-col items-start">
      <span className={cn("text-base font-semibold", titleClass)}>{name}</span>
      {isInactive && (
        <span className="text-[0.6875rem] text-secondary-text font-medium">
          {isDeleted ? t("deleted") : t("archived")}
        </span>
      )}
    </motion.div>
  );
}
