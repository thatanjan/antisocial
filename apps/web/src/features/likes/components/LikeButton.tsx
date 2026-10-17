"use client";

import { Heart } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleLikeAction } from "../actions/toggle-like";

/**
 * Interface for the properties of the LikeButton component.
 */
interface LikeButtonProps {
  /** Initial like status from the server */
  initialIsLiked: boolean;
  /** Initial like count from the server */
  initialLikeCount: number;
  /** UUID of the post to toggle likes for */
  postId: string;
  /** Whether the current user is the owner of the post */
  isOwner: boolean;
}

/**
 * LikeButton component for toggling likes on a post.
 * Implemented as a client component to support optimistic UI updates.
 */
export function LikeButton({
  initialIsLiked,
  initialLikeCount,
  postId,
  isOwner,
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

    if (isOwner) {
      toast.error("You cannot like your own post!");
      return;
    }

    startTransition(async () => {
      addOptimisticLike(newIsLiked);
      const result = await toggleLikeAction(postId);

      if (!result.success) {
        toast.error(result.error || "Failed to toggle like");
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
