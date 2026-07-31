import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/animate-ui/components/radix/dialog";
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
  if (!imageUrl) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="w-[calc(100%-2.5rem)] max-w-4xl overflow-hidden border-none bg-surface p-0 shadow-2xl flex flex-col items-center justify-center"
        closeButtonClassName="top-3 right-3 p-2.5 bg-black/80 text-white opacity-100 shadow-lg ring-1 ring-white/60 hover:bg-black hover:text-white hover:opacity-100 focus-visible:ring-2 focus-visible:ring-white"
      >
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
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
      </DialogContent>
    </Dialog>
  );
}
