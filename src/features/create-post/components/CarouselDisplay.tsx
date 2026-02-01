"use client";

import NextImage from "next/image";
import * as React from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { AspectRatio } from "../types";

interface PostImage {
  id: string;
  url: string;
}

interface CarouselDisplayProps {
  /** Array of images to display in the carousel */
  images: PostImage[];
  /** Aspect ratio to enforce for all images in the carousel */
  aspectRatio: AspectRatio;
}

/**
 * Component to display a carousel of post images.
 * Uses Shadcn Carousel and respects the post's aspect ratio.
 * Enforces the aspect ratio using ImageKit transformations for optimized delivery.
 */
export function CarouselDisplay({ images, aspectRatio }: CarouselDisplayProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (images.length === 0) return null;

  const aspectRatioClass = {
    "1:1": "aspect-square",
    "16:9": "aspect-video",
    "4:5": "aspect-4/5",
  }[aspectRatio];

  // Map aspect ratio string to ImageKit transformation string
  const ikAspectRatio = aspectRatio.replace(":", "-");

  return (
    <div className="relative w-full overflow-hidden rounded-md border border-border">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => {
            // Append ImageKit transformation for aspect ratio and cropping
            const optimizedUrl = image.url.includes("ik.imagekit.io")
              ? `${image.url}?tr=ar-${ikAspectRatio},fo-auto,w-1000`
              : image.url;

            return (
              <CarouselItem key={image.id}>
                <div className={cn("relative w-full", aspectRatioClass)}>
                  <NextImage
                    alt={`Post image ${index + 1}`}
                    className="object-cover"
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={optimizedUrl}
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2 h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80" />
            <CarouselNext className="right-2 h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80" />
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-300",
                    current === i ? "w-3 bg-white" : "bg-white/50",
                  )}
                  key={images[i].id}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </div>
  );
}
