"use client";

import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import NextImage from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AspectRatio, ImageKitUploadResponse } from "../types";
import { compressImage } from "../utils/image-compression";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const AUTH_ENDPOINT = "/api/upload-auth";

interface ImageUploaderProps {
  onImagesChange: (images: ImageKitUploadResponse[]) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  maxImages?: number;
}

/**
 * Component for selecting, compressing, and uploading multiple images to ImageKit.
 */
export function ImageUploader({
  onImagesChange,
  aspectRatio,
  onAspectRatioChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<
    ImageKitUploadResponse[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const ikUploadRef = useRef<HTMLInputElement>(null);

  const handleUploadSuccess = (res: ImageKitUploadResponse) => {
    const newImages = [...uploadedImages, res];
    setUploadedImages(newImages);
    onImagesChange(newImages);
  };

  const handleUploadError = (err: unknown) => {
    console.error("Upload error:", err);
    alert("Failed to upload image. Please try again.");
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesChange(newImages);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadedImages.length >= maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    if (!PUBLIC_KEY) {
      alert("ImageKit public key is not configured.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Compress Image
      const compressedFile = await compressImage(file);

      // 2. Get Auth Params
      const authRes = await fetch(AUTH_ENDPOINT);
      const authData = await authRes.json();

      // 3. Upload to ImageKit
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("fileName", `post_${Date.now()}.jpg`);
      formData.append("publicKey", PUBLIC_KEY);
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire.toString());
      formData.append("token", authData.token);
      formData.append("useUniqueFileName", "true");
      formData.append("folder", "/posts");

      const uploadRes = await fetch(
        `https://upload.imagekit.io/api/v1/files/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadRes.ok) throw new Error("Upload failed");

      const result = (await uploadRes.json()) as ImageKitUploadResponse;
      handleUploadSuccess(result);
    } catch (err) {
      handleUploadError(err);
    } finally {
      setIsUploading(false);
      if (ikUploadRef.current) ikUploadRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          Images ({uploadedImages.length}/{maxImages})
        </Label>
        <div className="flex gap-2">
          {(["1:1", "16:9", "4:5"] as AspectRatio[]).map((ratio) => (
            <Button
              className="h-8 text-xs"
              key={ratio}
              onClick={() => onAspectRatioChange(ratio)}
              size="sm"
              type="button"
              variant={aspectRatio === ratio ? "default" : "outline"}
            >
              {ratio}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {uploadedImages.map((img, index) => (
          <div
            className={cn(
              "group relative overflow-hidden rounded-md border border-border bg-muted",
              aspectRatio === "1:1" && "aspect-square",
              aspectRatio === "16:9" && "aspect-video",
              aspectRatio === "4:5" && "aspect-4/5",
            )}
            key={img.fileId}
          >
            <NextImage
              alt={`Upload ${index + 1}`}
              className="h-full w-full object-cover"
              height={100}
              src={img.thumbnailUrl}
              unoptimized
              width={100}
            />
            <button
              className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => removeImage(index)}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {uploadedImages.length < maxImages && (
          <div
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-border border-dashed transition-colors hover:bg-accent/50",
              aspectRatio === "1:1" && "aspect-square",
              aspectRatio === "16:9" && "aspect-video",
              aspectRatio === "4:5" && "aspect-4/5",
            )}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  Upload
                </span>
              </>
            )}
            <input
              accept="image/*"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              disabled={isUploading}
              onChange={onFileChange}
              ref={ikUploadRef}
              type="file"
            />
          </div>
        )}
      </div>

      {!uploadedImages.length && !isUploading && (
        <div className="flex items-center gap-2 rounded-md bg-accent/20 p-4 text-muted-foreground text-sm">
          <ImageIcon className="h-4 w-4" />
          <span>Upload images to make your post more engaging.</span>
        </div>
      )}
    </div>
  );
}
