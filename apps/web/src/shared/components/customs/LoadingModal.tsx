"use client";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { createPortal } from "react-dom";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";

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
  const mounted = useMounted();

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl bg-surface p-6 shadow-xl dark:bg-surface min-w-40",
          className,
        )}
      >
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-2 text-sm font-medium text-secondary-text dark:text-zinc-200">
          {message}
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
