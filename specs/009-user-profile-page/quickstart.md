# Quickstart: User Profile Page

## Overview

This guide outlines the implementation steps for the user profile page feature.

## Prerequisites

- Next.js development server running (`npm run dev`)
- PostgreSQL database with existing user data
- Authenticated user session

## Implementation Steps

### 1. Create Feature Directory Structure

```text
src/features/user-profile/
├── components/
│   ├── ProfileHeader.tsx
│   ├── ProfileTabs.tsx
│   └── ProfilePage.tsx
├── hooks/
│   └── useFollowStatus.ts (if needed)
├── utils/
│   └── format-user-stats.ts
└── types/
    └── index.ts
```

### 2. Create Profile Page Route

Create `src/app/profile/[username]/page.tsx`:

```tsx
// Server component that fetches user data and renders ProfilePage
```

### 3. Create ProfileHeader Component

Displays:
- Profile picture (Avatar)
- Display name and username
- Bio text
- Follower/following counts
- Join date
- Follow/Unfollow or Edit Profile button

### 4. Create ProfileTabs Component

Client component with tabs:
- Posts (active by default)
- Shorts (placeholder)
- Tags (placeholder)
- Activity (placeholder)

### 5. Create ProfilePage Component

Main component that:
- Renders ProfileHeader
- Renders ProfileTabs
- Displays posts list (reuse existing PostList component)

### 6. Add Follow Button Logic

- Check if current user is viewing their own profile
- Fetch follow status for other users
- Call existing follow/unfollow server actions

## Testing

1. Navigate to `/profile/[your-username]`
2. Verify profile information displays correctly
3. Verify "Edit Profile" button appears (not "Follow")
4. Navigate to another user's profile
5. Verify "Follow" button appears
6. Click "Follow" and verify status changes to "Unfollow"
7. Click "Unfollow" and verify status changes back to "Follow"
8. Verify posts list displays user's posts

## Rollback

If issues arise, the feature can be disabled by:
1. Removing the `/profile/[username]` route
2. No database migrations required (uses existing User and Post models)
