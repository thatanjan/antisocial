"use client";

import Image from "next/image";
import {
  Carousel,
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
  images: PostImage[];
  aspectRatio: AspectRatio;
}

/**
 * Component to display a carousel of post images.
 * Uses Shadcn Carousel and respects the post's aspect ratio.
 */
export function CarouselDisplay({ images, aspectRatio }: CarouselDisplayProps) {
  if (images.length === 0) return null;

  const aspectRatioClass = {
    "1:1": "aspect-square",
    "16:9": "aspect-video",
    "4:5": "aspect-4/5",
  }[aspectRatio];

  return (
    <div className="relative w-full overflow-hidden rounded-md border border-border">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className={cn("relative w-full", aspectRatioClass)}>
                <Image
                  alt={`Post image ${index + 1}`}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={image.url}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2 bg-background/50 backdrop-blur-sm hover:bg-background/80" />
            <CarouselNext className="right-2 bg-background/50 backdrop-blur-sm hover:bg-background/80" />
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((item) => (
                <div
                  className="h-1.5 w-1.5 rounded-full bg-white/50 shadow-sm"
                  key={item.id}
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </div>
  );
}
