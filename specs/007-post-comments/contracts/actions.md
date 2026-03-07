# Server Action Contracts: Post Comments

All actions are protected and require a valid session (authenticated user).

## Add Comment
- `addCommentAction(postId: string, content: string)`
- **Response**: `{ success: boolean, comment?: PostComment, error?: string }`
- **Side Effect**: Increments `Post.commentCount`.

## Update Comment
- `updateCommentAction(commentId: string, content: string)`
- **Response**: `{ success: boolean, comment?: PostComment, error?: string }`
- **Side Effect**: None (no count change).

## Delete Comment
- `deleteCommentAction(commentId: string)`
- **Response**: `{ success: boolean, error?: string }`
- **Side Effect**: Decrements `Post.commentCount` by `(1 + replyCount)`.

## Toggle Comment Like
- `toggleCommentLikeAction(commentId: string)`
- **Response**: `{ success: boolean, isLiked: boolean, likeCount: number, error?: string }`
- **Side Effect**: Increments/decrements `PostComment.likeCount`.

## Add Reply
- `addReplyAction(commentId: string, content: string)`
- **Response**: `{ success: boolean, reply?: CommentReply, error?: string }`
- **Side Effect**: Increments `Post.commentCount` AND `PostComment.replyCount`.

## Update Reply
- `updateReplyAction(replyId: string, content: string)`
- **Response**: `{ success: boolean, reply?: CommentReply, error?: string }`

## Delete Reply
- `deleteReplyAction(replyId: string)`
- **Response**: `{ success: boolean, error?: string }`
- **Side Effect**: Decrements `Post.commentCount` AND `PostComment.replyCount`.

## Toggle Reply Like
- `toggleReplyLikeAction(replyId: string)`
- **Response**: `{ success: boolean, isLiked: boolean, likeCount: number, error?: string }`
- **Side Effect**: Increments/decrements `CommentReply.likeCount`.

## Fetch Comments
- `getCommentsAction(postId: string, limit?: number, offset?: number)`
- **Response**: `{ comments: PostComment[], total: number }`

## Fetch Replies
- `getRepliesAction(commentId: string, limit?: number, offset?: number)`
- **Response**: `{ replies: CommentReply[], total: number }`
