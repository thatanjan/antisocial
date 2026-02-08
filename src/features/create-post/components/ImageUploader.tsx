"use client";

import { Plus, Upload, X } from "lucide-react";
import NextImage from "next/image";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AspectRatio } from "../types";

interface SelectedFile {
  file: File;
  preview: string;
  id: string; // ID for stable keys and tracking
}

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  maxImages?: number;
}

/**
 * Component for selecting images and previewing them in a carousel.
 * Supports multiple file selection in one go.
 */
export function ImageUploader({
  onFilesChange,
  aspectRatio,
  onAspectRatioChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync current slide with state
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Clean up selection preview URLs only when they are actually removed
  const prevFilesRef = useRef<SelectedFile[]>([]);
  useEffect(() => {
    const removedFiles = prevFilesRef.current.filter(
      (prev) => !selectedFiles.find((curr) => curr.id === prev.id),
    );

    for (const f of removedFiles) {
      URL.revokeObjectURL(f.preview);
    }

    prevFilesRef.current = selectedFiles;
  }, [selectedFiles]);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      for (const f of prevFilesRef.current) {
        URL.revokeObjectURL(f.preview);
      }
    };
  }, []);

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles.map((f) => f.file));

    // If we removed the last item and were on it, move back
    if (current >= newFiles.length && newFiles.length > 0) {
      api?.scrollTo(newFiles.length - 1);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const availableSlots = maxImages - selectedFiles.length;

    if (availableSlots <= 0) {
      alert(`You can only upload up to ${maxImages} images.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const filesToProcess = filesArray.slice(0, availableSlots);
    if (filesArray.length > availableSlots) {
      alert(
        `You can only select up to ${maxImages} images. Some files were skipped.`,
      );
    }

    const newSelections: SelectedFile[] = filesToProcess.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${Math.random().toString(36).substring(7)}`,
    }));

    const updatedFiles = [...selectedFiles, ...newSelections];
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles.map((f) => f.file));

    if (fileInputRef.current) fileInputRef.current.value = "";

    // Scroll to the start of the new batch
    setTimeout(() => {
      api?.scrollTo(selectedFiles.length);
    }, 50);
  };

  const aspectRatioClass = {
    "1:1": "aspect-square",
    "16:9": "aspect-video",
    "4:5": "aspect-4/5",
  }[aspectRatio];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="font-medium text-sm">
          Images ({selectedFiles.length}/{maxImages})
        </Label>
        <div className="flex gap-2">
          {(["1:1", "16:9", "4:5"] as AspectRatio[]).map((ratio) => (
            <Button
              className="h-8 font-medium text-xs"
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

      {selectedFiles.length > 0 ? (
        <div className="group relative">
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {selectedFiles.map((f, index) => (
                <CarouselItem key={f.id}>
                  <div
                    className={cn(
                      "relative w-full overflow-hidden rounded-lg border bg-muted shadow-inner",
                      aspectRatioClass,
                    )}
                  >
                    <NextImage
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      fill
                      src={f.preview}
                      unoptimized
                    />
                    <div className="absolute top-2 right-2 flex gap-2 overflow-hidden px-1 py-1 transition-opacity group-hover:opacity-100 sm:opacity-0">
                      <Button
                        className="h-8 w-8 rounded-full shadow-lg backdrop-blur-md"
                        onClick={() => removeImage(index)}
                        size="icon"
                        type="button"
                        variant="destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {selectedFiles.length > 1 && (
              <>
                <CarouselPrevious className="left-2 h-8 w-8 border-none bg-background/50 backdrop-blur-md hover:bg-background/80" />
                <CarouselNext className="right-2 h-8 w-8 border-none bg-background/50 backdrop-blur-md hover:bg-background/80" />
              </>
            )}
          </Carousel>

          {/* Pagination/Scroll Strip */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="scrollbar-hide flex flex-1 gap-1.5 overflow-x-auto pb-1">
              {selectedFiles.map((f, i) => (
                <button
                  className={cn(
                    "h-1.5 rounded-full shadow-sm transition-all duration-300",
                    current === i
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-border hover:bg-muted-foreground",
                  )}
                  key={`dot-${f.id}`}
                  onClick={() => api?.scrollTo(i)}
                  type="button"
                />
              ))}
            </div>
            {selectedFiles.length < maxImages && (
              <Button
                className="h-8 shrink-0 gap-2 border-dashed"
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                type="button"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Add More
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Button
          className={cn(
            "relative flex h-auto min-h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-border border-dashed transition-all hover:border-primary/50 hover:bg-accent/50",
            aspectRatioClass,
          )}
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="ghost"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary opacity-80" />
            </div>
            <div className="text-center">
              <span className="block font-semibold text-foreground">
                Click to upload images
              </span>
              <span className="mt-1 text-muted-foreground/60 text-xs italic">
                Support for multiple files up to {maxImages} photos
              </span>
            </div>
          </div>
        </Button>
      )}

      <input
        accept="image/*"
        className="hidden"
        multiple
        onChange={onFileChange}
        ref={fileInputRef}
        type="file"
      />
    </div>
  );
}
