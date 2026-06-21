# Server Actions Contracts: News Feed

## getFeed

Fetch paginated feed of posts from followed users.

### Input

```typescript
{
  cursor?: string | null  // ISO timestamp for pagination
  limit?: number          // Default 20, max 50
}
```

### Output

```typescript
{
  success: true,
  data: {
    posts: Post[],
    nextCursor: string | null,
    hasMore: boolean
  }
}
```

### Errors

```typescript
{
  success: false,
  error: "NOT_AUTHENTICATED" | "FEED_FETCH_FAILED"
}
```

### Validation

- `cursor`: Must be valid ISO timestamp string or null/undefined
- `limit`: Must be positive integer ≤ 50, defaults to 20
- User must be authenticated

---

## invalidateFeedCache

Manually invalidate a user's feed cache (called on follow/unfollow).

### Input

```typescript
{
  userId: string
}
```

### Output

```typescript
{
  success: true
}
```

### Errors

```typescript
{
  success: false,
  error: "INVALIDATE_FAILED"
}
```

---

## Fan-out Post (Internal)

Called from create-post after post creation.

### Input

```typescript
{
  postId: string,
  authorId: string,
  createdAt: Date
}
```

### Output

```typescript
{
  success: true,
  fanOutCount: number  // Number of followers cache was updated
}
```

### Notes

- Only executes for "hot" users (>1000 followers)
- Failures are logged but don't block post creation
- Uses batch Redis operations for efficiency