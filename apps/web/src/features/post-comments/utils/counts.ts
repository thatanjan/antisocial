import type { Prisma } from "@/generated/client/client";

/**
 * Increments the comment count for a post.
 * This should be used within a transaction.
 *
 * @param tx - Prisma transaction client
 * @param postId - ID of the post
 * @param amount - Amount to increment (default: 1)
 */
export const incrementPostCommentCount = async (
  tx: Prisma.TransactionClient,
  postId: string,
  amount: number = 1,
) => {
  await tx.post.update({
    where: { id: postId },
    data: { commentCount: { increment: amount } },
  });
};

/**
 * Decrements the comment count for a post.
 * This should be used within a transaction.
 *
 * @param tx - Prisma transaction client
 * @param postId - ID of the post
 * @param amount - Amount to decrement (default: 1)
 */
export const decrementPostCommentCount = async (
  tx: Prisma.TransactionClient,
  postId: string,
  amount: number = 1,
) => {
  await tx.post.update({
    where: { id: postId },
    data: { commentCount: { decrement: amount } },
  });
};

/**
 * Increments the reply count for a comment.
 * This should be used within a transaction.
 *
 * @param tx - Prisma transaction client
 * @param commentId - ID of the comment
 * @param amount - Amount to increment (default: 1)
 */
export const incrementCommentReplyCount = async (
  tx: Prisma.TransactionClient,
  commentId: string,
  amount: number = 1,
) => {
  await tx.postComment.update({
    where: { id: commentId },
    data: { replyCount: { increment: amount } },
  });
};

/**
 * Decrements the reply count for a comment.
 * This should be used within a transaction.
 *
 * @param tx - Prisma transaction client
 * @param commentId - ID of the comment
 * @param amount - Amount to decrement (default: 1)
 */
export const decrementCommentReplyCount = async (
  tx: Prisma.TransactionClient,
  commentId: string,
  amount: number = 1,
) => {
  await tx.postComment.update({
    where: { id: commentId },
    data: { replyCount: { decrement: amount } },
  });
};

/**
 * Increments the like count for a comment.
 * This should be used within a transaction.
 *
 * @param tx - Prisma transaction client
 * @param commentId - ID of the comment
 * @param amount - Amount to increment (default: 1)
 */
export const incrementCommentLikeCount = async (
  tx: Prisma.TransactionClient,
  commentId: string,
  amount: number = 1,
) => {
  await tx.postComment.update({
    where: { id: commentId },
    data: { likeCount: { increment: amount } },
  });
};

/**
 * Decrements the like count for a comment.
 * This should be used within a transaction.
 *
 * @param tx - Prisma transaction client
 * @param commentId - ID of the comment
 * @param amount - Amount to decrement (default: 1)
 */
export const decrementCommentLikeCount = async (
  tx: Prisma.TransactionClient,
  commentId: string,
  amount: number = 1,
) => {
  await tx.postComment.update({
    where: { id: commentId },
    data: { likeCount: { decrement: amount } },
  });
};

/**
 * Increments the like count for a reply.
 * This should be used within a transaction.
 *
 * @param tx - Prisma transaction client
 * @param replyId - ID of the reply
 * @param amount - Amount to increment (default: 1)
 */
export const incrementReplyLikeCount = async (
  tx: Prisma.TransactionClient,
  replyId: string,
  amount: number = 1,
) => {
  await tx.commentReply.update({
    where: { id: replyId },
    data: { likeCount: { increment: amount } },
  });
};

/**
 * Decrements the like count for a reply.
 * This should be used within a transaction.
 *
 * @param tx - Prisma transaction client
 * @param replyId - ID of the reply
 * @param amount - Amount to decrement (default: 1)
 */
export const decrementReplyLikeCount = async (
  tx: Prisma.TransactionClient,
  replyId: string,
  amount: number = 1,
) => {
  await tx.commentReply.update({
    where: { id: replyId },
    data: { likeCount: { decrement: amount } },
  });
};
