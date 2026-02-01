import imageCompression from "browser-image-compression";

/**
 * Options for image compression.
 */
const defaultOptions = {
  maxSizeMB: 1, // Maximum file size is 1MB
  maxWidthOrHeight: 1920, // Max resolution
  useWebWorker: true,
};

/**
 * Compresses an image file before uploading.
 * 
 * @param file - The original file object from the input.
 * @param options - Optional override for compression settings.
 * @returns A promise that resolves with the compressed File object.
 */
export const compressImage = async (
  file: File,
  options: typeof defaultOptions = defaultOptions
): Promise<File> => {
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Image compression failed:", error);
    // If compression fails, return the original file as fallback
    return file;
  }
};
