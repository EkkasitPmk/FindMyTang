import { motion, AnimatePresence } from "motion/react";
import { Asset } from "@/shared/lib/types/asset.type";
import { getAssetIcon } from "@/shared/components/customs/AssetIcon";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/shared/components/animate-ui/primitives/radix/collapsible";
import {
  getManageAssetItemClasses,
  getAssetItemStatus,
} from "../helpers/asset.helper";
import ManageAssetActions from "./ManageAssetActions";
import ManageAssetSelectionIndicator from "./ManageAssetSelectionIndicator";
import ManageAssetDetails from "./ManageAssetDetails";
import ManageAssetRightControls from "./ManageAssetRightControls";
import { useTranslation } from "@/shared/lib/hooks/useTranslation.hook";

interface ManageAssetItemProps {
  asset: Asset;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  isEditingList?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  index?: number;
  draggedIndex?: number | null;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
  onTouchStart?: (index: number) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

export default function ManageAssetItem({
  asset,
  isExpanded,
  onToggle,
  onEdit,
  onArchive,
  onUnarchive,
  onRestore,
  onDelete,
  isEditingList,
  isSelected,
  onToggleSelect,
  index,
  draggedIndex,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: Readonly<ManageAssetItemProps>) {
  const { locale } = useTranslation();
  const {
    isDeleted,
    isArchived,
    isInactive,
    isBeingDragged,
    iconStyle,
    containerStyle,
  } = getAssetItemStatus(asset, index, draggedIndex);

  const {
    titleClass,
    iconBgClass,
    containerClasses,
    headerClasses,
    balanceClass,
  } = getManageAssetItemClasses({
    isDeleted,
    isArchived,
    isInactive,
    isExpanded,
    isEditingList: Boolean(isEditingList),
    isSelected: Boolean(isSelected),
    draggable: Boolean(draggable),
    hasColor: Boolean(asset.color),
    isBeingDragged,
  });

  const headerButton = (
    <Button
      variant="unstyled"
      type="button"
      tapScale={1}
      hoverScale={1}
      onClick={isEditingList ? onToggleSelect : undefined}
      className={cn(headerClasses, "w-full")}
    >
      <motion.div layout className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <AnimatePresence>
            <ManageAssetSelectionIndicator
              isEditingList={isEditingList}
              isSelected={isSelected}
            />
          </AnimatePresence>
          <motion.span layout className={iconBgClass} style={iconStyle}>
            {getAssetIcon(asset.type, isInactive ? null : asset.color)}
          </motion.span>
          <ManageAssetDetails
            name={asset.name}
            titleClass={titleClass}
            isInactive={isInactive}
            isDeleted={isDeleted}
          />
        </div>
        <ManageAssetRightControls
          balance={asset.balance}
          locale={locale}
          balanceClass={balanceClass}
          isEditingList={isEditingList}
          index={index}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      </motion.div>
    </Button>
  );

  return (
    <Collapsible
      open={!isEditingList && isExpanded}
      onOpenChange={isEditingList ? undefined : () => onToggle()}
      className={cn(containerClasses, "group/collapsible")}
      style={{
        ...containerStyle,
        touchAction: draggable ? "none" : "auto",
      }}
      draggable={draggable}
      onDragStart={(e) => index !== undefined && onDragStart?.(e, index)}
      onDragOver={(e) => index !== undefined && onDragOver?.(e, index)}
      onDragEnd={onDragEnd}
      onTouchStart={() => {
        if (draggable && index !== undefined) onTouchStart?.(index);
      }}
      onTouchMove={(e) => {
        if (draggable) onTouchMove?.(e);
      }}
      onTouchEnd={() => {
        if (draggable) onTouchEnd?.();
      }}
      data-index={index}
    >
      {isEditingList ? (
        headerButton
      ) : (
        <CollapsibleTrigger asChild>{headerButton}</CollapsibleTrigger>
      )}

      <CollapsibleContent>
        <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
          <ManageAssetActions
            isDeleted={isDeleted}
            isArchived={isArchived}
            onEdit={onEdit}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            onRestore={onRestore}
            onDelete={onDelete}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
