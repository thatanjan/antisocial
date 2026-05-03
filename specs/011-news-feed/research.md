# Research: News Feed Feature

**Date**: 2026-05-03  
**Feature**: News Feed (Followees-only feed)  
**Spec**: specs/011-news-feed/spec.md

## Technical Decisions

### Redis Client Library

**Decision**: Use `@upstash/redis` for Redis integration  
**Rationale**: The technical context specifies `@upstash/redis` as the dependency. It's designed specifically for Next.js and provides built-in rate limiting, automatic retry, and works with Upstash's Redis offering. Alternative options (ioredis, node-redis) were considered but this is the mandated choice.

### Feed Data Structure

**Decision**: Use Redis sorted set with `feed:{userId}` as key, `postId` as member, `createdAt` timestamp as score  
**Rationale**: Sorted sets naturally support:
- Reverse chronological ordering (by score descending)
- Efficient pagination (ZREVRANGEBYSCORE)
- O(log N) insertions and deletions
- TTL support for automatic expiration

**Alternatives considered**:
- List (LPUSH/LTRIM): More complex for pagination, no native score-based operations
- Hash: Requires manual sorting, harder to handle pagination

### Hot User Threshold Strategy

**Decision**: Users with >1000 followers are "hot" → fan-out-on-write; others → fan-out-on-load  
**Rationale**: 
- 1000 follower threshold balances write amplification vs. read latency
- Hot users benefit from pre-computed feed (many readers, few writes per post)
- Normal users avoid unnecessary cache writes (few readers, many potential writes)

**Alternatives considered**:
- All fan-out-on-write: Too much write amplification for high-following users
- All fan-out-on-load: Slower initial load, but simpler

### Pagination Approach

**Decision**: Cursor-based pagination using createdAt timestamp  
**Rationale**: Cursor-based is more stable than offset for deep pagination (avoids skipped/dup items when data changes during scroll). Timestamp cursors work naturally with the sorted set score.

### Fan-out Failure Handling

**Decision**: Log error but don't block post creation on fan-out failure  
**Rationale**: User-facing write latency must remain fast. Cache inconsistency is acceptable because:
- Cache miss rebuilds correctly
- TTL ensures eventual consistency

### Cache Invalidation Strategy

**Decision**: Delete follower's feed cache on follow/unfollow; TTL handles cleanup for deleted posts  
**Rationale**: 
- Follow/unfollow changes who appears in feed → must invalidate
- Deleted posts naturally excluded on next cache miss (filter out non-existent postIds)

## Environment & Dependencies

- **REDIS_URL**: Required for Upstash connection
- **REDIS_TOKEN**: Required for authentication
- **@upstash/redis**: Redis client (see package.json after install)

## Blocked Users

**Status**: No explicit block feature exists in current schema  
**Assumption**: Block functionality will be added separately or is out of scope for MVP. The feed will implement a placeholder that returns all posts (excluding blocked users would require new schema or assume none exist).

## Known Integration Points

1. **Existing Feed Page**: `src/app/(authenticated)/feed/page.tsx` currently shows all posts (no filtering). Needs modification.
2. **Post Creation**: `src/features/create-post/actions/` - need to add fan-out call after post creation.
3. **Follow Actions**: `src/features/follow/actions/` - need to add cache invalidation on follow/unfollow.
4. **Prisma Schema**: No changes needed - existing Post, User, Follow models are sufficient.
5. **Post Index**: Already exists on `Post.authorId` - sufficient for feed queries.

## Best Practices Applied

- Server-side rendering for initial load (per constitution)
- Graceful degradation when cache unavailable
- TTL-based automatic cache cleanup
- Cursor-based stable pagination