/**
 * Types and interfaces for the Post Comments and Replies feature.
 */

import type { Author } from "@/features/create-post/types";

/**
 * Interface for a top-level comment on a post.
 */
export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  author: Author;
  content: string;
  likeCount: number;
  replyCount: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for a reply to a top-level comment.
 */
export interface CommentReply {
  id: string;
  commentId: string;
  authorId: string;
  author: Author;
  content: string;
  likeCount: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Result of the comment server actions.
 */
export type CommentActionResult =
  | { success: true; comment: PostComment; error?: never }
  | { success: false; comment?: never; error: string };

/**
 * Result of the reply server actions.
 */
export type ReplyActionResult =
  | { success: true; reply: CommentReply; error?: never }
  | { success: false; reply?: never; error: string };

/**
 * Result of the toggle like server actions.
 */
export type ToggleLikeResult =
  | { success: true; isLiked: boolean; likeCount: number; error?: never }
  | { success: false; isLiked?: never; likeCount?: never; error: string };

/**
 * Result of the delete server actions.
 */
export type DeleteActionResult =
  | { success: true; error?: never }
  | { success: false; error: string };

/**
 * Response for fetching comments with pagination.
 */
export interface FetchCommentsResponse {
  comments: PostComment[];
  total: number;
}

/**
 * Response for fetching replies with pagination.
 */
export interface FetchRepliesResponse {
  replies: CommentReply[];
  total: number;
}
