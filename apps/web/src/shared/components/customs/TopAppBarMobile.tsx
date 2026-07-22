import { cn } from "@/shared/lib/utils/core.util";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/components/customs/Button";

interface TopAppBarMobileProps {
  title: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function TopAppBarMobile({
  title,
  showBackButton = true,
  onBack,
  rightAction,
}: Readonly<TopAppBarMobileProps>) {
  return (
    <div
      className={cn(
        "flex items-center relative border-b border-border h-12",
        !showBackButton && rightAction && "justify-end",
        showBackButton && rightAction && "justify-between",
      )}
    >
      {showBackButton && onBack && (
        <Button
          variant="unstyled"
          type="button"
          onClick={onBack}
          className="p-1 ml-1 cursor-pointer"
        >
          <ChevronLeft size={24} />
        </Button>
      )}
      <div className="absolute left-1/2 -translate-x-1/2 text-base font-medium flex items-center justify-center">
        {title}
      </div>
      {rightAction}
    </div>
  );
}
