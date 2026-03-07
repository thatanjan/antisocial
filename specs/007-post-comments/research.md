# Research: Post Comments and Replies

## Auto-expandable Textarea

**Decision**: Implement a custom `AutoResizeTextarea` component or use a specialized hook.
**Rationale**: Shadcn's basic `Textarea` is fixed height. For comments, a resizing input improves user experience.
**Alternatives Considered**:
- Fixed height textarea (Rejected: poor UX for long comments).
- ContentEditable (Rejected: harder to manage state/selection).
- External library like `react-textarea-autosize` (Rejected: preferring vanilla implementation to minimize dependencies, easy to replicate in CSS/JS).

## Optimistic UI for Comments

**Decision**: Use `useOptimistic` hook for adding, updating, and deleting comments.
**Rationale**: Matches the existing pattern for likes and provides "instant" feedback.
**Implementation**:
- `useOptimistic(comments, (state, { action, comment }) => { ... })`
- Needs unique temporary IDs for new comments to avoid key conflicts.

## Database Schema and Denormalization

**Decision**: Implement three new tables and add denormalized count fields to `Post` and the new `PostComment` table.
**Rationale**: User requested storing counts instead of counting every time for performance.
**Tables**:
- `PostComment`: `id`, `postId`, `authorId`, `content`, `likeCount`, `replyCount`, `createdAt`, `updatedAt`.
- `CommentLike`: `id`, `commentId`, `userId`, `createdAt`.
- `ReplyLike`: `id`, `replyId`, `userId`, `createdAt`.
- `CommentReply`: `id`, `commentId`, `authorId`, `content`, `likeCount`, `createdAt`, `updatedAt`.
**Denormalized Fields to add**:
- `Post.commentCount` (includes comments + replies).
- `PostComment.likeCount`.
- `PostComment.replyCount`.
- `CommentReply.likeCount`.

**Wait!** The user said: "total comments, total comment likes and replies should be stored in tables instead of counting every time".
This means:
- `Post.commentCount`
- `PostComment.likeCount`
- `PostComment.replyCount`
- `CommentReply.likeCount` (if we have likes on replies too - the spec says "People can like comments", usually this implies replies too since they are "comment-like").

## Server Actions and Scaling

**Decision**: Use Next.js Server Actions with `revalidatePath`.
**Rationale**: Standard for the project (Constitution IV).
**Pattern**:
- `addCommentAction(postId, content)` -> increments `Post.commentCount`.
- `deleteCommentAction(commentId)` -> decrements `Post.commentCount` by (1 + replies_count).
- `toggleCommentLikeAction(commentId)` -> increments/decrements `PostComment.likeCount`.

## Pagination (Load More)

**Decision**: Use a "Load More" button with a `limit` and `offset` (or cursor-based) query in Server Actions.
**Rationale**: Spec requires 5 comments at first, then 5 more.
**Implementation**: Fetch the next batch in a server action and append to the list.
