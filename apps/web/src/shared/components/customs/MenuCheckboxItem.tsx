import React from "react";
import { Check, ChevronRight } from "lucide-react";

interface MenuCheckboxItemProps {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
  hasSubMenu?: boolean;
  isSubMenuOpen?: boolean;
  children?: React.ReactNode;
  labelSize?: "xs" | "sm" | "base";
}

export default function MenuCheckboxItem({
  label,
  isSelected = false,
  onClick,
  hasSubMenu = false,
  isSubMenuOpen = false,
  children,
  labelSize = "xs",
}: Readonly<MenuCheckboxItemProps>) {
  return (
    <div
      role="menuitem"
      tabIndex={0}
      className={`relative flex items-center ${hasSubMenu ? "justify-between" : ""} gap-2 w-full px-3 py-1.5 hover:bg-surface-secondary cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <div className="flex items-center gap-2 w-full">
        <Check
          size={16}
          className={isSelected ? "text-primary" : "opacity-0"}
        />
        <span className={`text-${labelSize} w-full`}>{label}</span>
      </div>
      {hasSubMenu && (
        <ChevronRight
          size={16}
          className={`transition-transform ${isSubMenuOpen ? "rotate-90" : ""}`}
        />
      )}
      {hasSubMenu && isSubMenuOpen && children && (
        <div className="absolute top-full left-0 w-full bg-surface flex flex-col py-1 shadow-md rounded-md z-50 border border-border">
          {children}
        </div>
      )}
    </div>
  );
}
