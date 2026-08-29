import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import { cn } from "@/shared/lib/utils/core.util";

interface AssetActionButtonProps {
  compact: boolean;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant: "ghost" | "outline";
  className: string;
  expandedClassName: string;
}

export default function AssetActionButton({
  compact,
  label,
  icon: Icon,
  onClick,
  variant,
  className,
  expandedClassName,
}: Readonly<AssetActionButtonProps>) {
  return (
    <Button
      size={compact ? "icon" : "sm"}
      variant={variant}
      aria-label={label}
      title={compact ? label : undefined}
      className={cn(className, !compact && expandedClassName)}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <Icon size={14} className={compact ? undefined : "mr-2"} />
      {!compact && label}
    </Button>
  );
}
