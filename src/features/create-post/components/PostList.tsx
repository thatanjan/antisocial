"use client";

import type { Post } from "../types";
import { PostCard } from "./PostCard";

interface PostListProps {
  initialPosts: Post[];
  currentUserId: string;
  emptyReason?: "NO_FOLLOWEES" | "NO_POSTS";
}

export function PostList({
  initialPosts,
  currentUserId,
  emptyReason,
}: PostListProps) {
  const posts = initialPosts;

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
    </div>
  );
}
