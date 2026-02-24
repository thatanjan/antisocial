# Quickstart: Like Feature

## Development Setup

1. **Update Schema**:
   Run Prisma migration to add the `PostLikes` model.
   ```bash
   npx prisma migrate dev --name add_likes
   ```

2. **Generate Client**:
   ```bash
   npx prisma generate
   ```

## Implementation Steps

1. **Backend**:
   - Implement `toggleLikeAction` in `src/features/likes/actions/`.
   - Ensure authentication checks and self-like prevention.

2. **Frontend Components**:
   - Create `LikeButton.tsx` (Client Component) in `src/features/likes/components/`.
   - Use `useOptimistic` to manage the local state of likes.
   - Integrate `LikeButton` into the `PostCard.tsx` footer.

3. **Data Fetching**:
   - Update the post fetching logic to include `likeCount` and `isLiked` (for the current user).

## Verification

### Manual Verification
1. Log in.
2. Verify you cannot like your own post.
3. Log in as another user.
4. Click "Like" on a post:
   - UI should update instantly (heart fills).
   - Refresh and verify persistence.
5. Click again to "Dislike" (remove like):
   - Heart should empty instantly.
6. Simulate failure and verify UI reversion.
