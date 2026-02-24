"use client";

import { Heart } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleLikeAction } from "../actions/toggle-like";

interface LikeButtonProps {
  initialIsLiked: boolean;
  initialLikeCount: number;
  postId: string;
}

/**
 * LikeButton component for toggling likes on a post.
 * Implemented as a client component to support optimistic UI updates.
 */
export function LikeButton({
  initialIsLiked,
  initialLikeCount,
  postId,
}: LikeButtonProps) {
  const [optimisticState, addOptimisticLike] = useOptimistic(
    { isLiked: initialIsLiked, likeCount: initialLikeCount },
    (state, newIsLiked: boolean) => ({
      isLiked: newIsLiked,
      likeCount: newIsLiked ? state.likeCount + 1 : state.likeCount - 1,
    }),
  );

  const handleLike = async () => {
    const newIsLiked = !optimisticState.isLiked;

    startTransition(async () => {
      addOptimisticLike(newIsLiked);
      const result = await toggleLikeAction(postId);

      if (!result.success) {
        // Error handling can be added here (e.g., toast)
        console.error("Failed to toggle like:", result.error);
      }
    });
  };

  const { isLiked, likeCount } = optimisticState;

  return (
    <Button
      aria-label={isLiked ? "Unlike post" : "Like post"}
      className={cn(
        "gap-2 text-muted-foreground transition-colors",
        isLiked && "text-red-500 hover:text-red-600",
      )}
      onClick={handleLike}
      size="sm"
      variant="ghost"
    >
      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      <span>{likeCount}</span>
    </Button>
  );
}
