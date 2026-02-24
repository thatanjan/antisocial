"use client";

import type { Post } from "../types";
import { PostCard } from "./PostCard";

interface PostListProps {
  initialPosts: Post[];
  currentUserId: string;
}

/**
 * Client component to manage and display the feed of posts.
 * Uses useState to store and display the posts, allowing for future
 * client-side updates (like deleting a post from the list).
 */
export function PostList({ initialPosts, currentUserId }: PostListProps) {
  // Use initialPosts directly from props to ensure the list reflects
  // server-side revalidation (e.g. after a like toggle).
  const posts = initialPosts;

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
        <h3 className="font-semibold text-lg">No posts yet</h3>
        <p className="text-muted-foreground text-sm">
          Be the first one to share something!
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
