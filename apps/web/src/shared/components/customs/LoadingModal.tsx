import { useEffect } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/shared/lib/utils/core.util";
import { createPortal } from "react-dom";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";

export type ModalStatus = "loading" | "success" | "error" | "warning" | "info";

export interface LoadingModalProps {
  isOpen: boolean;
  status?: ModalStatus;
  message?: string;
  className?: string;
  icon?: React.ReactNode;
  autoCloseDelay?: number;
  onClose?: () => void;
}

export default function LoadingModal({
  isOpen,
  status = "loading",
  message = "Saving...",
  className,
  icon,
  autoCloseDelay,
  onClose,
}: Readonly<LoadingModalProps>) {
  const mounted = useMounted();

  useEffect(() => {
    if (!isOpen || status === "loading" || !onClose) return;

    const delay = autoCloseDelay ?? (status === "error" ? 2000 : 1000);
    const timer = setTimeout(() => {
      onClose();
    }, delay);

    return () => clearTimeout(timer);
  }, [isOpen, status, autoCloseDelay, onClose]);

  if (!isOpen || !mounted) return null;

  const renderIcon = () => {
    if (icon) return icon;

    switch (status) {
      case "success":
        return (
          <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-in zoom-in-75 duration-200" />
        );
      case "error":
        return (
          <XCircle className="h-10 w-10 text-red-500 animate-in zoom-in-75 duration-200" />
        );
      case "warning":
        return (
          <AlertTriangle className="h-10 w-10 text-amber-500 animate-in zoom-in-75 duration-200" />
        );
      case "info":
        return (
          <Info className="h-10 w-10 text-blue-500 animate-in zoom-in-75 duration-200" />
        );
      case "loading":
      default:
        return <Loader2 className="h-10 w-10 animate-spin text-primary" />;
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl bg-surface p-6 shadow-xl dark:bg-surface min-w-44 text-center",
          className,
        )}
      >
        {renderIcon()}
        <p className="mt-3 text-sm font-medium text-secondary-text dark:text-zinc-200">
          {message}
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
