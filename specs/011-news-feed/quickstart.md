# Quickstart: News Feed Feature

## Prerequisites

1. **Redis** - Required for caching layer
   - Set environment variables:
     ```
     REDIS_URL=your_upstash_redis_url
     REDIS_TOKEN=your_upstash_token
     ```

2. **Existing Features** - Must be functional:
   - User follow system (008-user-follow)
   - Post creation (004-create-post)

## Installation

```bash
npm install @upstash/redis
```

## Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `src/lib/redis.ts` | Redis client singleton |
| `src/features/feed/lib/feed-service.ts` | Feed logic functions |
| `src/features/feed/actions/get-feed.ts` | Server action to fetch feed |
| `src/features/feed/actions/invalidate-feed.ts` | Cache invalidation action |
| `src/features/feed/components/FeedList.tsx` | Feed UI component |

### Modify Existing

| File | Change |
|------|--------|
| `src/app/(authenticated)/feed/page.tsx` | Use new getFeed server action instead of direct DB query |
| `src/features/create-post/actions/index.ts` | Add fan-out call after post creation |
| `.env.local` | Add REDIS_URL and REDIS_TOKEN |

## Development

### 1. Setup Redis

Create `src/lib/redis.ts`:
```typescript
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
})
```

### 2. Create Feed Service

Create `src/features/feed/lib/feed-service.ts` with:
- `getFeedFromCache(userId, cursor, limit)`
- `getFeedFromDb(userId, cursor, limit)`
- `invalidateFeedCache(userId)`
- `fanOutPost(postId, authorId, createdAt)`

### 3. Update Feed Page

Replace direct Prisma query with:
```typescript
const { posts, nextCursor, hasMore } = await getFeed({ 
  limit: 20,
  cursor: searchParams.cursor 
})
```

### 4. Handle Post Creation

After creating a post, check if author is "hot" (>1000 followers) and fan out to followers' caches.

### 5. Handle Follow/Unfollow

Call `invalidateFeedCache(followerId)` when a user follows/unfollows someone.

## Testing

1. **Follow a user** → Create posts as that user → Check your feed shows those posts
2. **Pagination** → Create >20 posts → Scroll through pages
3. **Cache fallback** → Temporarily disable Redis → Feed still works
4. **Hot user fan-out** → Create post as user with >1000 followers → Check follower caches are updated

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| REDIS_URL | Yes | Upstash Redis connection string |
| REDIS_TOKEN | Yes | Upstash Redis token |