/**
 * Feed types for the news feed feature.
 */

export interface FeedPost {
  id: string;
  content: string | null;
  images: FeedPostImage[];
  author: FeedUser;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface FeedPostImage {
  id: string;
  url: string;
  orderIndex: number;
}

export interface FeedUser {
  id: string;
  name: string;
  image: string | null;
}

export interface FeedResponse {
  posts: FeedPost[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface GetFeedInput {
  cursor?: string | null;
  limit?: number;
}

export interface InvalidateFeedInput {
  userId: string;
}

export type GetFeedResult =
  | {
      success: true;
      data: {
        posts: FeedPost[];
        nextCursor: string | null;
        hasMore: boolean;
      };
    }
  | {
      success: false;
      error: string;
    };

export interface FeedCacheResult {
  postIds: string[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PrismaPostForFeed {
  id: string;
  content: string | null;
  createdAt: Date;
  likeCount: number;
  commentCount: number;
  author: { id: string; name: string; image: string | null };
  images: Array<{ id: string; url: string; orderIndex: number }>;
}
