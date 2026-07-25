import { Circle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface ManageAssetSelectionIndicatorProps {
  isEditingList?: boolean;
  isSelected?: boolean;
}

export default function ManageAssetSelectionIndicator({
  isEditingList,
  isSelected,
}: Readonly<ManageAssetSelectionIndicatorProps>) {
  if (!isEditingList) return null;

  return (
    <motion.div
      key="selection-indicator-wrapper"
      initial={{ opacity: 0, scale: 0, width: 0, marginRight: -8 }}
      animate={{ opacity: 1, scale: 1, width: "auto", marginRight: 0 }}
      exit={{ opacity: 0, scale: 0, width: 0, marginRight: -8 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="flex items-center justify-center shrink-0 overflow-hidden"
    >
      <motion.div
        key={isSelected ? "selected" : "unselected"}
        initial={{ scale: 0.4, opacity: 0, rotate: isSelected ? -90 : 90 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.4, opacity: 0, rotate: isSelected ? 90 : -90 }}
        whileTap={{ scale: 0.82 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        {isSelected ? (
          <CheckCircle2
            size={20}
            className="text-primary fill-primary/15 stroke-[2.2]"
          />
        ) : (
          <Circle
            size={20}
            className="text-disabled-text hover:text-secondary-text transition-colors stroke-[1.8]"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
