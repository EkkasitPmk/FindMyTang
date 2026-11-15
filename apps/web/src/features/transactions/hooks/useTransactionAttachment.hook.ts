import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { toast } from "react-toastify";
import { compressImageFile } from "../utils/image.util";

export function useTransactionAttachment(
  getErrorMessage: (key: "errProcessAttachment") => string,
) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoadingAttachment, setIsLoadingAttachment] = useState(false);
  const [removedAttachment, setRemovedAttachment] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const originalFile = event.target.files?.[0];
    if (!originalFile) return;

    try {
      setIsLoadingAttachment(true);
      setFile(await compressImageFile(originalFile));
    } catch {
      event.target.value = "";
      toast.error(getErrorMessage("errProcessAttachment"));
    } finally {
      setIsLoadingAttachment(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setRemovedAttachment(true);
    setIsLoadingAttachment(false);
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
    isLoadingAttachment,
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
