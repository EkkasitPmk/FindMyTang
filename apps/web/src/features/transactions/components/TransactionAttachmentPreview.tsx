import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";

interface TransactionAttachmentPreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
}

export function TransactionAttachmentPreview({
  src,
  alt,
  onRemove,
}: Readonly<TransactionAttachmentPreviewProps>) {
  return (
    <div className="group relative flex h-113 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-secondary/50 p-2">
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="h-full w-full object-contain"
        unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
      />
      <Button
        variant="unstyled"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute right-3 top-3 rounded-full border border-expense bg-expense/80 p-2 text-white shadow-sm transition-colors hover:bg-expense"
      >
        <X size={16} className="text-white" />
      </Button>
    </div>
  );
}
