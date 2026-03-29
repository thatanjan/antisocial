"use server";

import type { Post } from "@/features/create-post/types";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

const PAGE_SIZE = 20;

/**
 * Parameters for fetching user posts.
 */
interface GetUserPostsParams {
  /** The user ID whose posts to fetch */
  userId: string;
  /** Cursor for pagination (post ID to start after) */
  cursor?: string;
}

/**
 * Result of fetching user posts.
 */
interface GetUserPostsResult {
  /** Array of posts */
  posts: Post[];
  /** Cursor for next page (null if no more posts) */
  nextCursor: string | null;
  /** Whether there are more posts to load */
  hasMore: boolean;
}

/**
 * Fetches posts for a user profile with cursor-based pagination.
 * Returns posts sorted by creation date (newest first).
 * Includes author info, images, and like status for the current user.
 *
 * @param params - The fetch parameters including userId and optional cursor
 * @returns Promise resolving to posts array and pagination info
 *
 * @example
 * ```ts
 * // Fetch first page
 * const result = await getUserPosts({ userId: "123" });
 *
 * // Fetch next page
 * const nextResult = await getUserPosts({
 *   userId: "123",
 *   cursor: result.nextCursor ?? undefined
 * });
 * ```
 */
export async function getUserPosts({
  userId,
  cursor,
}: GetUserPostsParams): Promise<GetUserPostsResult> {
  const session = await getSession();
  const currentUserId = session?.user?.id;

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      author: true,
      images: {
        orderBy: { orderIndex: "asc" },
      },
      postLikes: {
        where: {
          userId: currentUserId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: PAGE_SIZE + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
  });

  const hasMore = posts.length > PAGE_SIZE;
  const resultPosts = hasMore ? posts.slice(0, -1) : posts;

  const mappedPosts: Post[] = resultPosts.map((post) => ({
    id: post.id,
    content: post.content,
    aspectRatio: post.aspectRatio,
    createdAt: post.createdAt,
    author: {
      id: post.author.id,
      name: post.author.name,
      image: post.author.image,
    },
    images: post.images.map((img) => ({
      id: img.id,
      url: img.url,
    })),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    isLiked: post.postLikes.length > 0,
  }));

  return {
    posts: mappedPosts,
    nextCursor: hasMore ? mappedPosts[mappedPosts.length - 1]?.id : null,
    hasMore,
  };
}
