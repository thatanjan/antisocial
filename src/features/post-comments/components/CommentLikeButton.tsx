"use client";

import clsx from "clsx";
import { Heart } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import {
  toggleCommentLikeAction,
  toggleReplyLikeAction,
} from "../actions/likes";

/**
 * Props for the CommentLikeButton component.
 */
interface CommentLikeButtonProps {
  /** The ID of the comment or reply to like. */
  targetId: string;
  /** Whether the target is a top-level comment or a nested reply. */
  targetType: "comment" | "reply";
  /** The current number of likes from the server. */
  initialLikeCount: number;
  /** Whether the current user has already liked the item. */
  initialIsLiked: boolean;
}

/**
 * A reusable button component for liking comments and replies.
 * Uses React's useOptimistic hook to provide instant UI feedback and
 * useTransition to handle server side mutations smoothly.
 */
export const CommentLikeButton = ({
  targetId,
  targetType,
  initialLikeCount,
  initialIsLiked,
}: CommentLikeButtonProps) => {
  const [isPending, startTransition] = useTransition();

  // Optimistic state for the like count and liked status
  const [optimisticState, addOptimisticLike] = useOptimistic(
    { likeCount: initialLikeCount, isLiked: initialIsLiked },
    (state, newIsLiked: boolean) => {
      // Avoid negative likes if something goes wrong with state synchronization
      const diff = newIsLiked ? 1 : -1;
      return {
        isLiked: newIsLiked,
        likeCount: Math.max(0, state.likeCount + diff),
      };
    },
  );

  /**
   * Handles the toggle like interaction.
   * Optimistically updates the UI and then triggers the server action.
   */
  const handleToggleLike = async () => {
    // Prevent double submissions while a transition is active
    if (isPending) return;

    startTransition(async () => {
      const nextIsLiked = !optimisticState.isLiked;

      // Apply optimistic update
      addOptimisticLike(nextIsLiked);

      try {
        const action =
          targetType === "comment"
            ? toggleCommentLikeAction
            : toggleReplyLikeAction;

        const result = await action(targetId);

        if (!result.success) {
          // If the server returns an error, toast it.
          // useOptimistic will automatically revert to the initial state once the transition ends.
          toast.error(result.error || `Failed to like ${targetType}`);
        }
      } catch (error) {
        console.error(`Error toggling ${targetType} like:`, error);
        toast.error(
          `An unexpected error occurred while liking the ${targetType}.`,
        );
      }
    });
  };

  return (
    <button
      className={clsx(
        "flex items-center gap-1.5 font-medium text-[11px] outline-none transition-all duration-200 active:scale-90",
        optimisticState.isLiked
          ? "text-primary dark:text-primary"
          : "text-muted-foreground hover:text-primary",
        isPending ? "cursor-wait opacity-80" : "cursor-pointer",
      )}
      disabled={isPending}
      onClick={handleToggleLike}
      title={optimisticState.isLiked ? "Unlike" : "Like"}
      type="button"
    >
      <Heart
        className={clsx(
          "h-3.5 w-3.5 transition-all duration-300",
          optimisticState.isLiked
            ? "fill-primary text-primary"
            : "fill-transparent",
          isPending && "animate-pulse",
        )}
      />
      <span className="tabular-nums">
        {optimisticState.likeCount > 0 ? optimisticState.likeCount : "Like"}
      </span>
    </button>
  );
};
