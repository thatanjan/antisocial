# Quickstart: Guest Mode Implementation

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Docker (optional, for full stack)

## Steps

### 1. Update Database Schema

Add `isAnonymous` field to User model in `prisma/schema.prisma`:

```prisma
model User {
  // ... existing fields
  isAnonymous Boolean @default(false)
}
```

Run migration:
```bash
npx prisma migrate dev --name add_is_anonymous
```

### 2. Update Auth Configuration

**Server** (`src/lib/auth.ts`):
```typescript
import { anonymous } from "better-auth/plugins"

export const auth = betterAuth({
  plugins: [
    anonymous({
      emailDomainName: "antisocial.app"
    }),
    nextCookies(),
  ],
})
```

**Client** (`src/lib/authClient.ts`):
```typescript
import { anonymousClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [anonymousClient()],
})
```

### 3. Create Guest Mode Components

Create in `src/features/guest-mode/components/`:
- `GuestButton.tsx` - "Continue as Guest" button
- `GuestConfirmationModal.tsx` - Confirmation dialog with warning

### 4. Update Login Page

Add GuestButton to `/src/app/(auth)/login/page.tsx`

### 5. Update Navigation

Update `ProfileSummary` component to:
- Show "Guest" for anonymous users
- Add "Exit Guest Mode" option in menu

### 6. Handle Restricted Actions

For each restricted action (create post, like, comment, follow):
- Check `session?.user.isAnonymous`
- Show registration prompt if true

## Verification

1. Visit login page → "Continue as Guest" button visible
2. Click button → Modal appears with warning
3. Confirm → Redirected to feed as guest
4. Profile shows "Guest" username
5. Try to create post → Registration prompt shown
6. Click "Exit Guest Mode" → Redirected to login