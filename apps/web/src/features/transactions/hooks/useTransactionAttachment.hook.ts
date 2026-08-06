import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { toast } from "react-toastify";
import { compressImageFile } from "../utils/image.util";

export function useTransactionAttachment(
  getErrorMessage: (key: "errProcessAttachment") => string,
) {
  const [file, setFile] = useState<File | null>(null);
  const [removedAttachment, setRemovedAttachment] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const originalFile = event.target.files?.[0];
    if (!originalFile) return;

    try {
      setFile(await compressImageFile(originalFile));
    } catch {
      event.target.value = "";
      toast.error(getErrorMessage("errProcessAttachment"));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setRemovedAttachment(true);
  };

  const handleTakeAPhoto = () => {
    setIsPhotoMenuOpen(false);
    cameraInputRef.current?.click();
  };

  const handleSelectAPhoto = () => {
    setIsPhotoMenuOpen(false);
    fileInputRef.current?.click();
  };

  return {
    file,
    setFile,
    removedAttachment,
    setRemovedAttachment,
    isPhotoMenuOpen,
    setIsPhotoMenuOpen,
    fileInputRef,
    cameraInputRef,
    handleFileChange,
    handleRemoveFile,
    handleTakeAPhoto,
    handleSelectAPhoto,
  };
}
