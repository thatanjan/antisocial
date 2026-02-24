"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  initialIsLiked: boolean;
  initialLikeCount: number;
  postId: string;
}

/**
 * LikeButton component for toggling likes on a post.
 * Implementated as a client component to support optimistic UI updates.
 */
export function LikeButton({
  initialIsLiked,
  initialLikeCount,
  postId,
}: LikeButtonProps) {
  // Placeholder for optimistic state and toggle logic (T007)
  const isLiked = initialIsLiked;
  const likeCount = initialLikeCount;

  return (
    <Button
      aria-label={isLiked ? "Unlike post" : "Like post"}
      className={cn(
        "gap-2 text-muted-foreground transition-colors",
        isLiked && "text-red-500 hover:text-red-600",
      )}
      size="sm"
      variant="ghost"
    >
      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      <span>{likeCount}</span>
    </Button>
  );
}
