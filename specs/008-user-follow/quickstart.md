# Quickstart: User Follow System Implementation

**Feature**: User Follow System  
**Branch**: 008-user-follow  
**Date**: March 21, 2026

## Prerequisites

- PostgreSQL database with partitioning support
- Prisma ORM configured
- Better Auth for user authentication

---

## Implementation Steps

### 1. Database Schema Update

Run the following to update your Prisma schema:

```bash
# Update prisma/schema.prisma with Follow model
# Then run migration
npx prisma migrate dev --name add_follow_system
```

### 2. Create Server Actions

Create in `src/features/follow/actions/`:

- `follow-user.ts` - Handle follow action
- `unfollow-user.ts` - Handle unfollow action
- `get-followers.ts` - Get user's followers
- `get-following.ts` - Get user's following

### 3. Create Components

Create in `src/features/follow/components/`:

- `follow-button.tsx` - Follow/Unfollow toggle button
- `followers-list.tsx` - Display followers list
- `following-list.tsx` - Display following list

---

## Key Implementation Details

### Count Maintenance

```typescript
// On follow action - update both users
await prisma.user.update({
  where: { id: followerId },
  data: { followingCount: { increment: 1 } }
});
await prisma.user.update({
  where: { id: followeeId },
  data: { followerCount: { increment: 1 } }
});
```

### Self-Follow Prevention

```typescript
// In follow-user action
if (followerId === followeeId) {
  return { success: false, error: "Cannot follow yourself" };
}
```

### Duplicate Prevention

The unique constraint in the database will reject duplicates. Handle the error gracefully:

```typescript
try {
  await prisma.follow.create({ data: { followerId, followeeId } });
} catch (error) {
  if (error.code === 'P2002') { // Prisma unique constraint error
    return { success: false, error: "Already following this user" };
  }
}
```

---

## File Structure

```
src/features/follow/
├── actions/
│   ├── follow-user.ts
│   ├── unfollow-user.ts
│   ├── get-followers.ts
│   └── get-following.ts
├── components/
│   ├── follow-button.tsx
│   ├── followers-list.tsx
│   └── following-list.tsx
├── types/
│   └── index.ts
└── utils/
    └── index.ts
```

---

## Testing Checklist

- [ ] User can follow another user
- [ ] User cannot follow themselves
- [ ] User cannot follow same user twice
- [ ] Follower/following counts are accurate
- [ ] Lists display correctly
- [ ] Unfollow works properly
- [ ] Concurrent requests handled correctly