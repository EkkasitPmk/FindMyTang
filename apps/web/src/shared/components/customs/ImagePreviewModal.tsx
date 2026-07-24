import { createPortal } from "react-dom";
import { useMounted } from "@/shared/lib/hooks/useMounted.hook";
import { X } from "lucide-react";
import { Button } from "@/shared/components/animate-ui/components/buttons/button";
import Image from "next/image";

export interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
}: Readonly<ImagePreviewModalProps>) {
  const mounted = useMounted();

  if (!isOpen || !imageUrl || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-primary-text/60 backdrop-blur-sm transition-opacity duration-300">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center animate-subtle-pop">
        <Button
          variant="unstyled"
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors cursor-pointer"
        >
          <X size={24} />
        </Button>
        <div className="relative w-full h-[70vh]">
          <Image
            src={imageUrl}
            alt="Attachment Preview"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
