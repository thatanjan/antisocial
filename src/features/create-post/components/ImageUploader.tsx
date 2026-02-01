"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AspectRatio } from "../types";

interface SelectedFile {
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  maxImages?: number;
}

/**
 * Component for selecting images and showing local previews.
 * Does NOT upload to ImageKit. Deferring upload to parent on form submission.
 */
export function ImageUploader({
  onFilesChange,
  aspectRatio,
  onAspectRatioChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up selection preview URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      for (const f of selectedFiles) {
        URL.revokeObjectURL(f.preview);
      }
    };
  }, [selectedFiles]);

  const removeImage = (index: number) => {
    const fileToRemove = selectedFiles[index];
    URL.revokeObjectURL(fileToRemove.preview);
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles.map((f) => f.file));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newSelections: SelectedFile[] = [];

    // Convert FileList to array and limit by maxImages
    const filesArray = Array.from(files);
    const availableSlots = maxImages - selectedFiles.length;
    const filesToProcess = filesArray.slice(0, availableSlots);

    if (filesArray.length > availableSlots) {
      alert(`You can only upload up to ${maxImages} images.`);
    }

    for (const file of filesToProcess) {
      newSelections.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    const updatedFiles = [...selectedFiles, ...newSelections];
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles.map((f) => f.file));

    // Clear input so same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          Images ({selectedFiles.length}/{maxImages})
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
        {selectedFiles.map((f, index) => (
          <div
            className={cn(
              "group relative overflow-hidden rounded-md border border-border bg-muted",
              aspectRatio === "1:1" && "aspect-square",
              aspectRatio === "16:9" && "aspect-video",
              aspectRatio === "4:5" && "aspect-4/5",
            )}
            key={f.preview}
          >
            <NextImage
              alt={`Selection ${index + 1}`}
              className="h-full w-full object-cover"
              height={100}
              src={f.preview}
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

        {selectedFiles.length < maxImages && (
          <Button
            className={cn(
              "relative flex h-auto cursor-pointer flex-col items-center justify-center rounded-md border-2 border-border border-dashed p-0 transition-colors hover:bg-accent/50",
              aspectRatio === "1:1" && "aspect-square",
              aspectRatio === "16:9" && "aspect-video",
              aspectRatio === "4:5" && "aspect-4/5",
            )}
            onClick={() => fileInputRef.current?.click()}
            type="button"
            variant="ghost"
          >
            <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Add Photo</span>
            <input
              accept="image/*"
              className="hidden"
              multiple
              onChange={onFileChange}
              ref={fileInputRef}
              type="file"
            />
          </Button>
        )}
      </div>

      {!selectedFiles.length && (
        <div className="flex items-center gap-2 rounded-md bg-accent/20 p-4 text-muted-foreground text-sm">
          <ImageIcon className="h-4 w-4" />
          <span>Select images to make your post more engaging.</span>
        </div>
      )}
    </div>
  );
}
