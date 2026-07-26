import { useState, useEffect } from "react";

export const useImagePreview = (file: File | null) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      queueMicrotask(() => setFilePreview(null));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    queueMicrotask(() => setFilePreview(objectUrl));

    // Clean up memory
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return filePreview;
};
