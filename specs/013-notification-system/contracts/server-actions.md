# Contracts: Notification Feature Server Actions

All server actions follow the existing project pattern: `"use server"`, Zod validation, typed return, session check.

## Action: `createNotification`

*Called internally by follow/like/comment actions — NOT exposed as a direct server action.*

```typescript
type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  type: 'follow' | 'like' | 'comment';
  targetType: 'post' | 'user';
  targetId: string;
  preview?: string;      // required/used when type === 'comment'
};

type CreateNotificationResult = { success: true };
```

**Invoked from**: follow action (after follow create), like action (after like create), comment action (after comment create).

**Rules**:
- MUST skip if `actorId === recipientId` (self-action guard — FR-004)
- MUST be called inside a transaction with the triggering action where possible

---

## Action: `getNotifications`

*Server action — fetches the current user's notifications.*

```typescript
// No input needed — session determines user
type GetNotificationsResult = {
  success: true;
  data: {
    notifications: Array<{
      id: string;
      type: 'follow' | 'like' | 'comment';
      read: boolean;
      preview: string | null;
      createdAt: string;   // ISO string
      actor: {
        id: string;
        name: string;
        image: string | null;
      } | null;            // null if actor deleted
      targetType: string | null;
      targetId: string | null;
    }>;
    unreadCount: number;
  };
} | { success: false; error: string };
```

**Query**: `findMany` on `Notification` where `recipientId === session.user.id`, ordered by `createdAt DESC`, include `actor` relation (select id, name, image).

---

## Action: `markNotificationRead`

```typescript
type MarkReadInput = { notificationId: string };
type MarkReadResult = { success: true } | { success: false; error: string };
```

**Logic**: `update` where `id === notificationId AND recipientId === session.user.id`, set `read: true`.

---

## Action: `markAllNotificationsRead`

```typescript
type MarkAllReadResult = { success: true; count: number } | { success: false; error: string };
```

**Logic**: `updateMany` where `recipientId === session.user.id AND read === false`, set `read: true`. Returns count of updated rows.

---

## Action: `getUnreadCount`

```typescript
type GetUnreadCountResult = { success: true; count: number } | { success: false; error: string };
```

**Query**: `count` where `recipientId === session.user.id AND read === false`.

---

## Action: `cleanupOldNotifications`

*Triggered by cron — no session check required, but MUST validate a CRON_SECRET token.*

```typescript
type CleanupInput = { cronSecret: string };
type CleanupResult = { success: true; deletedCount: number } | { success: false; error: string };
```

**Logic**: `deleteMany` where `createdAt < now() - 30 days`. Returns count of deleted rows.

**Security**: Validate `cronSecret === process.env.CRON_SECRET` before executing.

---

## Cron Route: `app/api/cron/cleanup-notifications/route.ts`

```typescript
// GET /api/cron/cleanup-notifications?secret=<CRON_SECRET>
// Returns JSON: { success: boolean, deletedCount?: number, error?: string }
```

**Purpose**: HTTP endpoint called by the GitHub Actions scheduled workflow (or manually for local dev).

## GitHub Actions Workflow: `.github/workflows/cleanup-notifications.yml`

```yaml
name: Cleanup old notifications

on:
  schedule:
    # Daily at 03:00 UTC
    - cron: '0 3 * * *'
  # Allow manual trigger for testing
  workflow_dispatch:

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Call cleanup API
        run: |
          curl -X GET "${{ secrets.APP_URL }}/api/cron/cleanup-notifications?secret=${{ secrets.CRON_SECRET }}"
```

**Requirements**:
- `APP_URL` secret: deployed app base URL (e.g., `https://antisocial.vercel.app`)
- `CRON_SECRET` secret: shared secret validated by the API route
