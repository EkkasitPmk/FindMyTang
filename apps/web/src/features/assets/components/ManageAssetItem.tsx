import { ChevronDown, Circle, CheckCircle2 } from "lucide-react";
import { Asset } from "../types/assets.type";
import { getAssetIcon } from "./AssetIcon";
import { Button } from "@/shared/components/customs/Button";
import { cn } from "@/shared/lib/utils/core.util";
import { getManageAssetItemClasses } from "../helpers/asset.helper";
import ManageAssetActions from "./ManageAssetActions";
import ManageAssetDragHandle from "./ManageAssetDragHandle";

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
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: Readonly<ManageAssetItemProps>) {
  const isDeleted = Boolean(asset.deletedAt);
  const isArchived = Boolean(asset.isArchived) && !isDeleted;
  const isInactive = isDeleted || isArchived;

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
  });

  const iconStyle =
    asset.color && !isInactive
      ? { backgroundColor: `${asset.color}1a`, color: asset.color }
      : undefined;

  const containerStyle = !isInactive
    ? { borderLeftColor: asset.color || "transparent" }
    : undefined;

  let selectionIndicator = null;
  if (isEditingList) {
    selectionIndicator = isSelected ? (
      <CheckCircle2 size={18} className="text-primary fill-primary/10" />
    ) : (
      <Circle size={18} className="text-gray-300" />
    );
  }

  const assetIconView = (
    <span className={iconBgClass} style={iconStyle}>
      {getAssetIcon(asset.type, isInactive ? null : asset.color)}
    </span>
  );

  const assetDetailsView = (
    <div className="flex flex-col items-start">
      <span className={cn("text-base font-semibold", titleClass)}>
        {asset.name}
      </span>
      {isInactive && (
        <span className="text-[11px] text-gray-500 font-medium">
          {isDeleted ? "Deleted" : "Archived"}
        </span>
      )}
    </div>
  );

  const assetRightControls = (
    <div className="flex items-center gap-2">
      <span className={balanceClass}>฿ {asset.balance.toLocaleString()}</span>
      {isEditingList ? (
        <ManageAssetDragHandle
          index={index}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      ) : (
        <ChevronDown
          size={16}
          className={cn(
            "text-gray-400 transition-transform",
            isExpanded && "-rotate-x-180",
          )}
        />
      )}
    </div>
  );

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      draggable={draggable}
      onDragStart={(e) => index !== undefined && onDragStart?.(e, index)}
      onDragOver={(e) => index !== undefined && onDragOver?.(e, index)}
      onDragEnd={onDragEnd}
      data-index={index}
    >
      <Button
        variant="unstyled"
        type="button"
        onClick={isEditingList ? onToggleSelect : onToggle}
        className={headerClasses}
      >
        <div className="flex items-center gap-3">
          {selectionIndicator}
          {assetIconView}
          {assetDetailsView}
        </div>
        {assetRightControls}
      </Button>

      {/* Expanded actions panel */}
      {isExpanded && !isEditingList && (
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 border-t border-gray-100",
            "animate-subtle-pop",
          )}
        >
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
      )}
    </div>
  );
}
