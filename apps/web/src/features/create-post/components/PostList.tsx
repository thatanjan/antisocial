"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { getFeedAction } from "@/features/feed/actions/get-feed";
import type { FeedPost } from "@/features/feed/types";
import type { Post } from "../types";
import { PostCard } from "./PostCard";

interface PostListProps {
  initialPosts: Post[];
  currentUserId: string;
  hasMore?: boolean;
  nextCursor?: string | null;
  emptyReason?: "NO_FOLLOWEES" | "NO_POSTS";
}

const mapFeedPostToPost = (p: FeedPost): Post => ({
  id: p.id,
  content: p.content,
  aspectRatio: p.aspectRatio,
  author: { id: p.author.id, name: p.author.name, image: p.author.image },
  images: p.images.map((img) => ({ id: img.id, url: img.url })),
  likeCount: p.likeCount,
  commentCount: p.commentCount,
  isLiked: p.isLiked,
  createdAt: p.createdAt,
});

export function PostList({
  initialPosts,
  currentUserId,
  hasMore: initialHasMore = false,
  nextCursor: initialNextCursor = null,
  emptyReason,
}: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (loading || !nextCursor || !hasMore) return;

    setLoading(true);
    try {
      const result = await getFeedAction({ cursor: nextCursor });
      if (!result.success) {
        console.error("Failed to load more posts:", result.error);
        return;
      }
      setPosts((prev) => [
        ...prev,
        ...result.data.posts.map(mapFeedPostToPost),
      ]);
      setNextCursor(result.data.nextCursor);
      setHasMore(result.data.hasMore);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, nextCursor, hasMore]);

  if (posts.length === 0) {
    if (emptyReason === "NO_FOLLOWEES") {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
          <h3 className="font-semibold text-lg">Follow some people</h3>
          <p className="text-muted-foreground text-sm">
            Your feed is empty because you are not following anyone yet. Find
            people to follow and their posts will show up here.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
        <h3 className="font-semibold text-lg">No posts yet</h3>
        <p className="text-muted-foreground text-sm">
          {emptyReason === "NO_POSTS"
            ? "People you follow have not posted anything yet."
            : "Be the first one to share something!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard currentUserId={currentUserId} key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button disabled={loading} onClick={handleLoadMore} variant="outline">
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}

      {!hasMore && (
        <p className="pt-4 text-center text-muted-foreground text-sm">
          No more posts to show
        </p>
      )}
    </div>
  );
}
