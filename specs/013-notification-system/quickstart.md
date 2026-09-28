# Quickstart: Notification System Validation

## Prerequisites

- Project running (`npm run dev` or `docker-compose up`)
- At least 2 user accounts with posts (for triggering follow/like/comment)
- No existing notifications (clean state)

## Setup

```bash
# Generate and apply notification migration
npx prisma migrate dev --name add_notification_model
```

## Validation Scenarios

### Scenario 1: Follow notification

```bash
# User A follows User B
# Navigate to User B's profile page and click "Follow"
```

**Expected**:
- User B's notification bell shows unread count = 1
- User B opens notification panel → sees "User A started following you" in "Today" group
- Notification appears unread (bold/highlighted)
- User B clicks notification → navigates to User A's profile
- Notification is now marked read (no highlight)

---

### Scenario 2: Like notification

```bash
# User A likes User B's post
# On User B's post, User A clicks the like heart icon
```

**Expected**:
- User B's notification bell increments to reflect new notification
- Notification reads: "User A liked your post"
- Clicking navigates to the post page

---

### Scenario 3: Comment notification

```bash
# User A comments on User B's post
# User A writes a comment on User B's post
```

**Expected**:
- User B receives notification: "User A commented: {first 200 chars of comment}"
- Empty/whitespace-only comments do NOT trigger notification
- Self-comment (User A commenting on own post) does NOT trigger notification

---

### Scenario 4: Mark all read

```bash
# User B has multiple unread notifications
# User B clicks "Mark all as read" button in notification panel
```

**Expected**:
- Unread count badge disappears
- All notifications appear in read style
- `getUnreadCount` returns 0

---

### Scenario 5: Notification cleanup (test cron)

Trigger manually via curl (local dev) or `workflow_dispatch` in GitHub Actions UI:

```bash
# Local dev: run cleanup directly
curl "http://localhost:3000/api/cron/cleanup-notifications?secret=local-secret"

# Or via psql: simulate old notification
psql $DATABASE_URL -c "UPDATE notification SET created_at = NOW() - INTERVAL '31 days' WHERE id = 'test-id'"
# Then re-trigger cleanup
```

**Expected**:
- API returns `{ "success": true, "deletedCount": <count> }`
- Notifications older than 30 days are removed
- Notifications under 30 days are preserved

---

### Scenario 6: Self-action suppression

```bash
# User A likes own post, comments on own post, follows own profile
```

**Expected**: No notifications created for any self-actions.

---

### Scenario 7: Actor deletion handles gracefully

```bash
# User A follows User B (notification created)
# User A deletes account
# User B views notifications
```

**Expected**: The follow notification still appears with "Deleted User" as the actor name (null actor shows fallback text).

---

## Quick Verification Script

```bash
# After setup, run through these checks manually:
# 1. Register/log in as User A and User B
# 2. User A follows User B → check User B's bell badge
# 3. User A likes User B's post → check bell badge increments
# 4. User A comments on User B's post → check bell badge increments
# 5. User B opens panel → verify all 3 notifications visible, newest first
# 6. User B marks one read → verify
# 7. User B marks all read → verify badge gone
# 8. Simulate old notification → run cleanup → verify deletion
```

## Reverting

```bash
# To remove notification table during development:
npx prisma migrate dev --create-only --name drop_notifications
# Review the generated SQL, then apply
npx prisma migrate dev
```
