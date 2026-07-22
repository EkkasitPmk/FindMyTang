import imageCompression from "browser-image-compression";

export async function compressImageFile(file: File): Promise<File> {
  try {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      initialQuality: 0.8,
    };
    const compressedFile = await imageCompression(file, options);
    return new File([compressedFile], file.name, {
      type: compressedFile.type || file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Error compressing image:", error);
    return file;
  }
}
