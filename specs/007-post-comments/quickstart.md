# Post Comments & Replies Quickstart

## Getting Started

Follow these steps to integrate comments into a post.

1.  **Update Database**:
    *   Add `commentCount` to the `Post` model in `prisma/schema.prisma`.
    *   Add `PostComment`, `CommentReply`, `CommentLike`, and `ReplyLike` models.
    *   Run `npx prisma generate` to update the client.

2.  **Server Actions**:
    *   Implement actions in `src/features/post-comments/actions/`.
    *   Ensure all count updates (denormalization) are performed within a Prisma transaction to maintain atomicity.

3.  **UI Components**:
    *   `src/features/post-comments/components/CommentList.tsx`: Handles data fetching and "Load More" logic.
    *   `src/features/post-comments/components/CommentItem.tsx`: Individual comment with likes and replies.
    *   `src/features/post-comments/components/CommentInput.tsx`: Auto-expandable textarea with Server Action submission.
    *   `src/features/post-comments/components/ReplyList.tsx`: Handles replies for a specific comment.

4.  **Optimistic UI Usage**:
    *   Use `useOptimistic` in `CommentList` for top-level comments.
    *   Use `useOptimistic` in `ReplyList` for replies.
    *   Toggle likes optimistically via `useOptimistic` in the like button.

5.  **Integration**:
    *   Add `<CommentList postId={post.id} />` to the post details page.
    *   Update `PostCard.tsx` to display the `commentCount` next to the `MessageCircle` icon.

## Denormalization Logic

Whenever a comment or reply is added/deleted, the `commentCount` on `Post` MUST be updated.
*   `Post.commentCount` = Top-level comments + all replies.
*   `PostComment.replyCount` = Replies per comment.

Example for deleting a comment:
```typescript
await prisma.$transaction([
  prisma.postComment.delete({ where: { id: commentId } }), // CASCADE handles replies/likes
  prisma.post.update({
    where: { id: postId },
    data: { commentCount: { decrement: totalRemovedCount } },
  }),
]);
```
