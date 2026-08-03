import { GripVertical } from "lucide-react";
import React from "react";

interface ManageAssetDragHandleProps {
  index?: number;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
  onTouchStart?: (index: number) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

export default function ManageAssetDragHandle({
  index,
  onDragStart,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: Readonly<ManageAssetDragHandleProps>) {
  return (
    <div
      className="p-1 touch-none cursor-grab active:cursor-grabbing"
      draggable={index !== undefined}
      onDragStart={(e) => {
        if (index !== undefined) onDragStart?.(e, index);
      }}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => {
        e.stopPropagation();
        if (index !== undefined) onTouchStart?.(index);
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
        onTouchMove?.(e);
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        onTouchEnd?.();
      }}
    >
      <GripVertical size={16} className="text-disabled-text" />
    </div>
  );
}
