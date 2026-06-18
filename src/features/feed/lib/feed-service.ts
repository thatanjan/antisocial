/**
 * Feed service functions for the news feed feature.
 * Handles both Redis caching and database fallback.
 */

"use server";

import prisma from "@/lib/prisma";
import {
  FEED_CACHE_MAX_SIZE,
  FEED_CACHE_TTL,
  HOT_USER_THRESHOLD,
  redis,
} from "@/lib/redis";
import type {
  FeedCacheResult,
  FeedPost,
  FeedResponse,
  PrismaPostForFeed,
} from "../types";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

const getCacheKey = (userId: string): string => `feed:${userId}`;

/**
 * Get feed posts from Redis cache (sorted set).
 */
export const getFeedFromCache = async (
  userId: string,
  cursor: string | null,
  limit: number,
): Promise<FeedCacheResult | null> => {
  try {
    const key = getCacheKey(userId);

    const min = "-inf";
    const max = cursor
      ? (`(${new Date(cursor).getTime()}` as "-inf" | "+inf" | `(${number}`)
      : "+inf";

    // zrange returns interleaved [member, score, member, score...] when withScores=true
    const results = await redis.zrange<string[]>(key, min, max, {
      byScore: true,
      rev: true,
      withScores: true,
      offset: 0,
      count: limit + 1,
    });

    // empty cache
    if (!results || results.length === 0) {
      return null;
    }

    const hasMore = results.length > limit * 2;
    const items = hasMore ? results.slice(0, limit * 2) : results;

    const postIds: string[] = [];
    let nextCursor: string | null = null;

    // parse interleaved [member, score, member, score...]
    for (let i = 0; i < items.length; i += 2) {
      postIds.push(items[i]);
      if (i === items.length - 2) {
        nextCursor = new Date(parseInt(items[i + 1], 10)).toISOString();
      }
    }

    return { postIds, nextCursor, hasMore };
  } catch (error) {
    console.error("Redis cache read error:", error);
    return null;
  }
};

/**
 * Store feed posts in Redis cache (sorted set).
 */
export const setFeedCache = async (
  userId: string,
  posts: Array<{ postId: string; createdAt: Date }>,
): Promise<void> => {
  try {
    const key = getCacheKey(userId);

    if (posts.length === 0) return;

    // store each post in sorted set with score = createdAt timestamp
    for (const p of posts) {
      await redis.zadd(key, { score: p.createdAt.getTime(), member: p.postId });
    }

    await redis.expire(key, FEED_CACHE_TTL);

    const count = await redis.zcard(key);
    if (count > FEED_CACHE_MAX_SIZE) {
      await redis.zremrangebyrank(key, 0, count - FEED_CACHE_MAX_SIZE - 1);
    }
  } catch (error) {
    console.error("Redis cache write error:", error);
  }
};

/**
 * Get feed posts from database (fallback when cache unavailable).
 */
export const getFeedFromDb = async (
  userId: string,
  cursor: string | null,
  limit: number,
): Promise<FeedResponse> => {
  const followees = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followeeId: true },
  });

  const followeeIds = followees.map((f) => f.followeeId);

  if (followeeIds.length === 0) {
    return {
      posts: [],
      nextCursor: null,
      hasMore: false,
      emptyReason: "NO_FOLLOWEES" as const,
    };
  }

  const cursorDate = cursor ? new Date(cursor) : undefined;

  // add some comment for the follwing block
  // fetch posts from followees, ordered by createdAt descending, with optional cursor for pagination
  // include author and images, limit to limit + 1 to check for hasMore
  // if cursor is provided, fetch posts created before the cursor date
  // if no posts are found and cursor is null, return emptyReason NO_POSTS
  const postsData = await prisma.post.findMany({
    where: {
      authorId: { in: followeeIds },
      ...(cursorDate ? { createdAt: { lt: cursorDate } } : {}),
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      images: { orderBy: { orderIndex: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
  });

  const hasMore = postsData.length > limit;
  const posts = hasMore ? postsData.slice(0, limit) : postsData;

  const nextCursor =
    posts.length > 0 ? posts[posts.length - 1].createdAt.toISOString() : null;

  return {
    posts: posts.map(transformToFeedPost),
    nextCursor,
    hasMore,
    ...(posts.length === 0 && cursor === null
      ? { emptyReason: "NO_POSTS" as const }
      : {}),
  };
};

/**
 * Transform Prisma post to FeedPost.
 */
const transformToFeedPost = (post: PrismaPostForFeed): FeedPost => {
  const { author, images, ...rest } = post;
  return {
    ...rest,
    isLiked: false,
    author: { id: author.id, name: author.name, image: author.image },
    images: images.map((img) => ({
      id: img.id,
      url: img.url,
      orderIndex: img.orderIndex,
    })),
  };
};

/**
 * Main function to get feed with cache fallback.
 */
export const getFeedFromFollowees = async (
  userId: string,
  cursor: string | null,
  limit: number,
): Promise<FeedResponse> => {
  const normalizedLimit = Math.min(
    Math.max(1, limit ?? DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );

  const cacheResult = await getFeedFromCache(userId, cursor, normalizedLimit);

  // cache hit: fetch posts by ids and maintain order
  if (cacheResult && cacheResult.postIds.length > 0) {
    const posts = await prisma.post.findMany({
      where: { id: { in: cacheResult.postIds } },
      include: {
        author: { select: { id: true, name: true, image: true } },
        images: { orderBy: { orderIndex: "asc" } },
      },
    });

    const postMap = new Map(posts.map((p) => [p.id, p]));
    const orderedPosts = cacheResult.postIds
      .map((id) => postMap.get(id))
      .filter((p): p is NonNullable<typeof p> => p !== null);

    return {
      posts: orderedPosts.map(transformToFeedPost),
      nextCursor: cacheResult.nextCursor,
      hasMore: cacheResult.hasMore,
    };
  }

  const postsFromDb = await getFeedFromDb(userId, cursor, normalizedLimit);

  if (postsFromDb.posts.length > 0 && cursor === null) {
    setFeedCache(
      userId,
      postsFromDb.posts.map((p) => ({ postId: p.id, createdAt: p.createdAt })),
    );
  }

  return postsFromDb;
};

/**
 * Invalidate a user's feed cache.
 */
export const invalidateFeedCache = async (userId: string): Promise<void> => {
  try {
    const key = getCacheKey(userId);
    await redis.del(key);
  } catch (error) {
    console.error("Redis cache invalidate error:", error);
  }
};

/**
 * Fan-out a post to followers' caches (for hot users).
 */
export const fanOutPostToFollowers = async (
  postId: string,
  authorId: string,
  createdAt: Date,
): Promise<{ success: boolean; fanOutCount: number }> => {
  try {
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { followerCount: true },
    });

    if (!author || author.followerCount <= HOT_USER_THRESHOLD) {
      return { success: true, fanOutCount: 0 };
    }

    const followers = await prisma.follow.findMany({
      where: { followeeId: authorId },
      select: { followerId: true },
      take: FEED_CACHE_MAX_SIZE,
    });

    const score = createdAt.getTime();
    const promises: Promise<unknown>[] = [];

    // add post to each follower's cache
    for (const follower of followers) {
      const key = getCacheKey(follower.followerId);
      promises.push(redis.zadd(key, { score, member: postId }));
      promises.push(redis.expire(key, FEED_CACHE_TTL));
    }

    await Promise.all(promises);

    return { success: true, fanOutCount: followers.length };
  } catch (error) {
    console.error("Fan-out error:", error);
    return { success: true, fanOutCount: 0 };
  }
};
