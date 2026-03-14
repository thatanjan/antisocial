# Data Model: Post Comments and Replies

## Entities

### Post (Existing - Updated)
- `commentCount`: `Int` (Default: 0) - Total number of comments + replies for this post.

### PostComment
Represents a top-level comment on a post.
- `id`: `String` (CUID, PK)
- `postId`: `String` (FK to Post)
- `authorId`: `String` (FK to User)
- `content`: `String` (Max 2000 chars)
- `likeCount`: `Int` (Default: 0)
- `replyCount`: `Int` (Default: 0)
- `createdAt`: `DateTime`
- `updatedAt`: `DateTime`

### CommentReply
Represents a reply to a top-level comment.
- `id`: `String` (CUID, PK)
- `commentId`: `String` (FK to PostComment)
- `authorId`: `String` (FK to User)
- `content`: `String` (Max 2000 chars)
- `likeCount`: `Int` (Default: 0)
- `createdAt`: `DateTime`
- `updatedAt`: `DateTime`

### CommentLike
Represents a like on a top-level comment.
- `id`: `String` (CUID, PK)
- `userId`: `String` (FK to User)
- `commentId`: `String` (FK to PostComment)
- `createdAt`: `DateTime`

### ReplyLike
Represents a like on a reply.
- `id`: `String` (CUID, PK)
- `userId`: `String` (FK to User)
- `replyId`: `String` (FK to CommentReply)
- `createdAt`: `DateTime`

## Relationships
- `Post` 1 --- N `PostComment`
- `PostComment` 1 --- N `CommentReply`
- `User` 1 --- N `PostComment`
- `User` 1 --- N `CommentReply`
- `User` 1 --- N `CommentLike`
- `User` 1 --- N `ReplyLike`
- `PostComment` 1 --- N `CommentLike`
- `CommentReply` 1 --- N `ReplyLike`

## Constraints
- `@@unique([userId, commentId])` for comment likes.
- `@@unique([userId, replyId])` for reply likes.
- Cascade delete: If `Post` deleted -> `PostComment` deleted -> `CommentReply` deleted.
- Cascade delete: If `User` deleted -> all their comments/replies/likes deleted.
