import { GripVertical } from "lucide-react";
import React from "react";

interface ManageAssetDragHandleProps {
  index?: number;
  onTouchStart?: (index: number) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
}

export default function ManageAssetDragHandle({
  index,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: Readonly<ManageAssetDragHandleProps>) {
  return (
    <div
      className="p-1 touch-none"
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
      <GripVertical
        size={16}
        className="text-disabled-text cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
