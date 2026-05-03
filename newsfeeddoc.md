# Newsfeed System - Implementation Plan

## What this feature is about (Non-technical)

This feature provides a personal, followees-only newsfeed for each user. It surfaces posts from people the user follows and presents them in reverse chronological order. The MVP focuses on reliability and speed: posts are stored in PostgreSQL, with Redis helping to locate followees quickly and optionally caching recent results for faster reads. No public API endpoints are involved yet; the feed is rendered on the server side to keep the experience simple and predictable.

Key user value:
- See the latest activity from people you follow in a single, scrollable feed
- Fast initial load and stable pagination
- Clear, predictable failure modes (cache optional; falls back to DB if needed)

## Technical Details

## Overview

Build a scalable newsfeed that shows posts from users the current user follows.

## Architecture: Hybrid Cache Strategy

### Cache Layer (Redis)

- **Key format**: feed:{userId} (sorted set)
- **Data**: postId as member, createdAt timestamp as score
- **TTL**: 180 seconds (3 minutes)
- **Max size**: 500 posts per user

### Hot User Threshold

- Users with >1000 followers are "hot"
- Hot users: fan-out-on-write (pre-push posts to followers caches)
- Normal users: fan-out-on-load (compute on-demand, cache result)

## Step-by-Step Flow

### Step 1: User Requests Feed

Call server action getFeed with cursor and limit parameters.

### Step 2: Check Redis Cache

Look for feed:{userId} sorted set. If exists and has posts, return cached posts.

### Step 3: Cache Miss - Fetch from DB

If cache miss or empty:

1. Get list of followed user IDs from Follow table
2. Query posts from those users ordered by createdAt descending
3. Store result in Redis cache with TTL

### Step 4: Return Feed Response

Return posts array, nextCursor string or null, and hasMore boolean.

### Step 5: User Creates Post

When a user creates a post:

1. Save post to database
2. Check if author has >1000 followers
3. If hot user:
   - Get all follower IDs
   - Add post to each followers feed cache
   - Set TTL on each cached feed
   - Trim to max 500 posts

### Step 6: User Follows/Unfollows

Delete follower's feed cache key. Next feed request will rebuild cache.

### Step 7: Deleted Posts

On feed read, filter out post IDs that no longer exist in DB. Next cache miss automatically cleans up.

## Database Indexes

Ensure index exists on post.authorId with createdAt for efficient feed generation. Follow table already has index on followerId with createdAt.

## Files to Create/Modify

1. src/lib/redis.ts - Redis client singleton
2. src/features/feed/lib/feed-service.ts - Feed logic functions
3. src/features/feed/actions/get-feed.ts - Server action to fetch feed
4. src/features/feed/actions/invalidate-feed.ts - Server action to invalidate cache
5. src/features/post/actions/create-post.ts - Add fan-out call
6. src/features/feed/components/feed-list.tsx - Infinite scroll UI
7. .env.local - Add REDIS_URL and REDIS_TOKEN

## Error Handling

- Redis unavailable: fallback to direct DB query
- Fan-out fails: log error, do not block post creation
- Post in cache but deleted: filter on read

## Environment Variables

- REDIS_URL=your_redis_connection_string
- REDIS_TOKEN=your_redis_token

## Dependencies

- @upstash/redis - Redis client for Next.js
