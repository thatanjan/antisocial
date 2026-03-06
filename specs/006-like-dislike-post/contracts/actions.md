# API Contracts: Like Actions

## Server Actions

### `toggleLikeAction`

Handles the logic for liking a post or removing an existing like.

**Location**: `src/features/likes/actions/toggle-like.ts`

**Input**:
```typescript
interface ToggleLikeInput {
  postId: string;
}
```

**Output**:
```typescript
type ToggleLikeResult = {
  success: true;
  data: {
    isLiked: boolean;
    likeCount: number;
  }
} | {
  success: false;
  error: string;
}
```

**Logic Flow**:
1. Check authentication.
2. Check if user is the author (block self-like).
3. Find existing Like record.
4. If exists -> **Delete**.
5. If not exists -> **Create**.
6. Return new state and count.
