import { X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface ModalFormProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "title"
> {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

export function ModalForm({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  ...props
}: Readonly<ModalFormProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-text/20 backdrop-blur-xs transition-opacity duration-300">
      {/* Click outside to close */}
      <div
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Dialog Content */}
      <form
        className={cn(
          "relative bg-surface border border-border rounded-xl shadow-lg max-w-sm w-full animate-subtle-pop z-10 overflow-hidden flex flex-col max-h-[90vh]",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50/50",
            headerClassName,
          )}
        >
          <div className="text-xl font-bold text-foreground">{title}</div>
          <Button
            variant="unstyled"
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div
          className={cn(
            "px-6 py-4 space-y-4 overflow-y-auto custom-scrollbar",
            contentClassName,
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              "flex items-center gap-3 px-6 py-4 bg-gray-50/80 border-t border-border mt-auto",
              footerClassName,
            )}
          >
            {footer}
          </div>
        )}
      </form>
    </div>
  );
}
