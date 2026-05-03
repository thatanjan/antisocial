# Data Model: News Feed

## Entities

### Feed Response (Server Action Return)

| Field | Type | Description |
|-------|------|-------------|
| posts | Post[] | Array of post objects |
| nextCursor | string \| null | Cursor for next page, null if no more pages |
| hasMore | boolean | Whether more posts exist |

### Post (Feed Item)

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique post identifier |
| content | string \| null | Post text content |
| images | PostImage[] | Attached images |
| author | User | Author details |
| likeCount | number | Total likes |
| commentCount | number | Total comments |
| isLiked | boolean | Whether current user liked this |
| createdAt | DateTime | Creation timestamp |

### User (Author)

| Field | Type | Description |
|-------|------|-------------|
| id | string | User identifier |
| name | string | Display name |
| image | string \| null | Avatar URL |

### PostImage

| Field | Type | Description |
|-------|------|-------------|
| id | string | Image identifier |
| url | string | Image URL |
| orderIndex | number | Display order |

## Data Flow

1. **Feed Request** → getFeed(userId, cursor?, limit?) → returns FeedResponse
2. **Cache Check** → Redis sorted set `feed:{userId}`
3. **Cache Miss** → Query DB: get followed users' posts → Cache result
4. **Post Created** → Fan-out: push to followers' cache (if hot user)
5. **Follow/Unfollow** → Delete `feed:{followerId}` cache key

## Validation Rules

- `cursor`: Must be valid ISO timestamp string or null
- `limit`: Must be positive integer, default 20, max 50
- User must be authenticated to request feed

## Relationships

- Feed depends on Follow relationship (existing)
- Feed depends on Post (existing)
- Feed depends on User (existing)
- No new models needed in Prisma schema