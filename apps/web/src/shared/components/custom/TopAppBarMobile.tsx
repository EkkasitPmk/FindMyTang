import { cn } from "@/shared/lib/utils";
import { ChevronLeft } from "lucide-react";

interface TopAppBarMobileProps {
  title: string;
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
        "flex items-center relative border-b border-gray-200 pb-2",
        !showBackButton && rightAction && "justify-end",
        showBackButton && rightAction && "justify-between",
      )}
    >
      {showBackButton && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="p-1 ml-1 cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      <span className="absolute left-1/2 -translate-x-1/2 text-base font-medium">
        {title}
      </span>
      {rightAction}
    </div>
  );
}
