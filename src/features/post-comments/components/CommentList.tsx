"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { getCommentsAction } from "../actions/comments";
import type { PostComment } from "../types";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";

/**
 * Props for the CommentList component.
 */
interface CommentListProps {
  /** The ID of the post to display comments for. */
  postId: string;
}

/**
 * CommentList component handles fetching, displaying, and adding comments
 * for a specific post. It implements Core Commenting (US1) and prepares
 * for pagination (US4) and management (US2).
 */
export const CommentList = ({ postId }: CommentListProps) => {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { data: session } = authClient.useSession();

  /**
   * Initial fetch of comments.
   */
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const result = await getCommentsAction(postId);
    setComments(result.comments);
    setTotalCount(result.total);
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  /**
   * Handle "Load More" logic - (US4 Integration ready).
   */
  const handleLoadMore = async () => {
    if (isFetchingMore || comments.length >= totalCount) return;
    setIsFetchingMore(true);
    const result = await getCommentsAction(postId, 5, comments.length);
    setComments((prev) => [...prev, ...result.comments]);
    setTotalCount(result.total);
    setIsFetchingMore(false);
  };

  /**
   * Callback for when a new comment is added.
   * Simple UI update for US1; US2/Phase 4 will introduce formal useOptimistic.
   */
  const handleCommentAdded = (newComment: PostComment) => {
    setComments((prev) => [newComment, ...prev]);
    setTotalCount((prev) => prev + 1);
  };

  return (
    <div className="fade-in flex animate-in flex-col gap-6 border-border/50 border-t py-6 duration-500">
      {/* Header / Summary */}
      <div className="flex items-center gap-2.5">
        <div className="rounded-full bg-primary/10 p-1.5 text-primary">
          <MessageSquare className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-foreground/90 text-sm uppercase tracking-tight">
          Comments{" "}
          {totalCount > 0 && (
            <span className="ml-1 font-medium text-muted-foreground italic">
              ({totalCount})
            </span>
          )}
        </h3>
      </div>

      {/* Input - US1 */}
      <CommentInput
        onCommentAdded={handleCommentAdded}
        placeholder="Share your thoughts..."
        postId={postId}
      />

      {/* Comments List */}
      <div className="flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
            <p className="font-medium text-xs italic">
              Loading conversation...
            </p>
          </div>
        ) : comments.length > 0 ? (
          <div className="divide-y divide-border/30">
            {comments.map((comment) => (
              <CommentItem
                comment={comment}
                currentUserId={session?.user?.id}
                key={comment.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-border/40 border-dashed bg-accent/5 py-14 text-center transition-all duration-300 hover:bg-accent/10">
            <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="font-medium text-muted-foreground/80 text-sm">
              No comments yet.
            </p>
            <p className="mt-1 text-muted-foreground/60 text-xs italic">
              Be the first to start the discussion!
            </p>
          </div>
        )}

        {/* Load More - US4 */}
        {!isLoading && comments.length < totalCount && (
          <div className="mt-6 flex justify-center border-border/20 border-t pt-6">
            <Button
              className="gap-2 font-bold text-muted-foreground text-xs transition-all duration-200 hover:scale-105 hover:text-primary active:scale-95"
              disabled={isFetchingMore}
              onClick={handleLoadMore}
              size="sm"
              variant="ghost"
            >
              {isFetchingMore ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>
                  LOAD MORE ({totalCount - comments.length} remaining)
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
