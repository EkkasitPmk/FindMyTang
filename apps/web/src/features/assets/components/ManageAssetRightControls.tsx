import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils/core.util";
import ManageAssetDragHandle from "./ManageAssetDragHandle";

interface ManageAssetRightControlsProps {
  balance: number;
  locale: string;
  balanceClass: string;
  isEditingList?: boolean;
  index?: number;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
  onTouchStart?: (index: number) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

export default function ManageAssetRightControls({
  balance,
  locale,
  balanceClass,
  isEditingList,
  index,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: Readonly<ManageAssetRightControlsProps>) {
  return (
    <motion.div layout className="flex items-center gap-2">
      <span className={balanceClass}>฿ {balance.toLocaleString(locale)}</span>
      <AnimatePresence mode="wait">
        {isEditingList ? (
          <motion.div
            key="drag-handle"
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ManageAssetDragHandle
              index={index}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chevron-down"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronDown
              size={16}
              className={cn(
                "text-disabled-text transition-transform duration-300",
                "group-data-[state=open]/collapsible:-rotate-180",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
