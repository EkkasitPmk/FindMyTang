import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  className?: string;
}

export default function LoadingModal({
  isOpen,
  message = "Saving...",
  className,
}: Readonly<LoadingModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 min-w-40",
          className,
        )}
      >
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {message}
        </p>
      </div>
    </div>
  );
}
