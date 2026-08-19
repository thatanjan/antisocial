# Tasks: Notification System

**Input**: Design documents from `/specs/013-notification-system/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/server-actions.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Include exact file paths in descriptions

## Path Conventions

- Feature root: `src/features/notifications/`
- Server actions: `src/features/notifications/actions/`
- Components: `src/features/notifications/components/`
- Types: `src/features/notifications/types/`
- Utils: `src/features/notifications/utils/`
- API: `src/app/api/cron/cleanup-notifications/`
- Workflows: `.github/workflows/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema, feature directory scaffolding, type definitions, and shared utilities that all stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 Add Notification model to `prisma/schema.prisma` with fields: id, recipientId, postId (nullable), actorId (nullable), type, read, createdAt. Relations to User (recipient, actor) and Post. Indexes on (recipientId, createdAt DESC), (recipientId, read), and (createdAt). Add `unreadNotifications Int @default(0)` counter to `User`. Denormalized unread count lives on top-level user, not a separate Notification storage.
- [x] T002 [P] Create `src/features/notifications/types/index.ts` with TypeScript types: NotificationType enum ('follow' | 'like' | 'comment'), NotificationData interface matching the Prisma shape (recipientId, postId?, actorId?, type, read, createdAt), and return types for all server actions (GetNotificationsResult, MarkReadResult, etc.)
- [x] T003 Generate and review the Prisma migration: `npx prisma migrate dev --create-only --name add_notification_model`. Present the SQL for user approval before applying.

**Checkpoint**: Prisma model exists, types defined, migration ready for approval.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared utilities required by multiple user stories.

- [x] T004 [P] Create `src/features/notifications/utils/create-notification.ts` — exported async function that takes CreateNotificationInput (recipientId, actorId, type, postId?) and creates a Notification record via Prisma. Must:
  - Skip if actorId === recipientId (self-action guard per FR-004)
  - Increment `User.unreadNotifications` counter on recipient by 1 (atomic, inside a transaction with the Notification create — rely on DB counter, not a recount)
  - Return `{ success: true }` on creation, `{ success: false, skipped: true }` on self-action
- [x] T005 [P] Create `src/features/notifications/utils/notification-lib.ts` with:
  - `formatNotificationText(type, actorName)` returning display string per research.md templates
  - `groupNotificationsByDate(notifications[])` returning date-bucketed groups: "Today", "Yesterday", "This Week", "This Month", "Older" using date-fns
  - `formatRelativeTime(date)` returning "2m ago", "1h ago", "3d ago" style strings

**Checkpoint**: `createNotification` works in isolation (can be tested via REPL or manual call), notification-lib formatting functions produce correct output.

---

## Phase 3: User Story 1 - View and Manage Notifications (Priority: P1) 🎯 MVP

**Goal**: Users can see a bell icon with unread count in the navbar, open a notification panel listing all notifications grouped by date, click to navigate to content, and mark notifications as read.

**Independent Test**: Log in as any user, seed a few Notification records directly in the DB for that user, then observe the bell badge, panel list, read/unread distinction, and navigation on click. No other user stories required.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `src/features/notifications/actions/get-notifications.ts` — server action that fetches the current user's notifications ordered by createdAt DESC, includes actor relation (id, name, image), and returns the data shape defined in contracts/server-actions.md.
- [x] T007 [P] [US1] Create `src/features/notifications/actions/mark-read.ts` — server action that accepts `notificationId`, validates ownership (recipientId === session.user.id), sets `read: true`, and decrements `unreadNotifications` by 1 on the recipient User (only if the notification was previously unread).
- [x] T008 [P] [US1] Create `markAllRead` in `mark-read.ts` — server action that runs `updateMany` where recipientId === session.user.id AND read === false, returns count of updated rows, and resets the recipient's `unreadNotifications` to 0.
- [x] T009 [P] [US1] Create `src/features/notifications/actions/get-unread-count.ts` — server action that returns the current user's `unreadNotifications` counter directly (read top-level User field, no DB count query).
- [x] T010 [US1] Create `src/features/notifications/components/notification-item.tsx` — renders a single notification row: actor avatar (or "Deleted User" fallback), formatted text ("{name} started following you"/"liked your post"/"commented on your post"), relative timestamp, read/unread visual distinction (bold + background for unread). Click handler navigates to post detail (via postId) or actor profile (follow type) and calls mark-read.
- [x] T011 [US1] Create `src/features/notifications/components/notification-panel.tsx` — "use client" component: fetches notifications via get-notifications action, groups by date using notification-lib, renders date group headers + notification-item rows. Includes "Mark all as read" button at top. Uses shadcn Sheet or DropdownMenu for the panel container.
- [x] T012 [US1] Create `src/features/notifications/components/notification-bell.tsx` — "use client" component: renders a Bell icon from lucide-react with a badge showing unread count (fetched via get-unread-count). Click opens the notification-panel. Polls unread count every 30s via setInterval + router.refresh or re-fetch.
- [ ] T013 [US1] Integrate NotificationBell into the app layout — locate the main navigation component (likely in `src/features/navigation/`) and add the NotificationBell component in the appropriate position (next to other nav icons).

**Checkpoint**: Log in as any user. Seed 5+ Notification records directly in `psql` for that user with varying `createdAt` timestamps (today, yesterday, last week). Verify:

- Bell icon shows correct unread count (from `User.unreadNotifications`)
- Panel opens with date-grouped list
- Unread items visually distinct
- Clicking a notification navigates to the correct URL (or shows "content no longer available" toast)
- "Mark all as read" clears the badge and resets the counter to 0

---

## Phase 4: User Story 2 - Receive Follow Notification (Priority: P1)

**Goal**: When User A follows User B, User B receives a follow notification.

**Independent Test**: User A follows User B → User B's notification bell shows +1 with "User A started following you". No like or comment features needed.

### Implementation for User Story 2

- [ ] T014 [US2] Integrate notification creation into `src/features/follow/actions/follow-actions.ts` — after the successful `db.follow.create()` and `incrementFollowCounts` calls, call `createNotification({ recipientUserId: followeeId, actorId: followerId, type: 'follow' })` (no postId for follow type). Import from `@/features/notifications/utils/create-notification`.

**Checkpoint**: User A follows User B → User B sees a follow notification in their panel. Unfollowing and re-following creates a new notification. Self-following produces no notification.

---

## Phase 5: User Story 3 - Receive Like Notification (Priority: P1)

**Goal**: When User A likes User B's post, User B receives a like notification.

**Independent Test**: User A likes User B's post → User B's notification bell shows +1 with "User A liked your post". No follow or comment features needed.

### Implementation for User Story 3

- [ ] T015 [US3] Integrate notification creation into `src/features/likes/actions/toggle-like.ts` — after the successful like creation (inside the Prisma transaction or immediately after it), call `createNotification({ recipientId: post.authorId, actorId: userId, type: 'like', postId })`. The post object is already fetched at the top of the action. Ensure notification is only created on like (not on unlike). Import from `@/features/notifications/utils/create-notification`.

**Checkpoint**: User A likes User B's post → User B sees a like notification. Self-liking produces no notification (already blocked by toggle-like.ts — verify no extra guard needed).

---

## Phase 6: User Story 4 - Receive Comment Notification (Priority: P1)

**Goal**: When User A comments on User B's post, User B receives a comment notification with a preview of the comment text.

**Independent Test**: User A comments on User B's post → User B's notification bell shows +1 with "User A commented: {preview}". No follow or like features needed.

### Implementation for User Story 4

- [ ] T016 [US4] Integrate notification creation into `src/features/post-comments/actions/comments.ts` — after successful comment creation in `addCommentAction`, call `createNotification({ recipientId: postAuthorId, actorId: session.user.id, type: 'comment', postId })`. Must fetch the post to get authorId if not already available. Self-comment prevention is handled by `createNotification`'s self-action guard.

**Checkpoint**: User A comments on User B's post → User B sees a comment notification with the comment preview. Commenting on own post produces no notification.

---

## Phase 7: User Story 5 - Automatic Notification Cleanup (Priority: P2)

**Goal**: Notifications older than 30 days are automatically deleted via a scheduled job.

**Independent Test**: Create a notification with `createdAt` older than 30 days (via psql), trigger the cleanup API route, verify the old notification is deleted while newer ones remain.

### Implementation for User Story 5

- [ ] T017 [P] [US5] Create `src/features/notifications/actions/cleanup-notifications.ts` — server action that accepts `cronSecret: string`, validates against `process.env.CRON_SECRET`, and runs `prisma.notification.deleteMany({ where: { createdAt: { lt: subDays(new Date(), 30) } } })`. Returns `{ success: true, deletedCount: number }`.
- [ ] T018 [P] [US5] Create `src/app/api/cron/cleanup-notifications/route.ts` — Next.js API route handling GET requests. Extracts `secret` from query params, calls cleanup-notifications action, returns JSON response with success/deletedCount/error. Add CORS or allow all origins for cron service.
- [ ] T019 [US5] Create `.github/workflows/cleanup-notifications.yml` — GitHub Actions workflow with `schedule: cron('0 3 * * *')` (daily 03:00 UTC) and `workflow_dispatch` trigger. Makes curl GET to `${{ secrets.APP_URL }}/api/cron/cleanup-notifications?secret=${{ secrets.CRON_SECRET }}`.

**Checkpoint**: Run `curl "http://localhost:3000/api/cron/cleanup-notifications?secret=test"` — returns JSON. Seed an old notification via psql, run again, verify it's deleted. Younger notifications are preserved.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, edge case handling.

- [ ] T020 Run the Prisma migration: apply the generated migration with `npx prisma migrate dev` (after user approval obtained in T003), then run `npx prisma generate`.
- [ ] T021 [P] Run quickstart validation guide (specs/013-notification-system/quickstart.md) — execute all 7 scenarios and verify expected outcomes.
- [ ] T022 [P] Add TSDoc comments to all exported functions in the notifications feature — create-notification.ts, all actions, all components.
- [ ] T023 Handle edge case: deleted actor. In `notification-item.tsx`, when `actor` is null, display "Deleted User" as the actor name (per spec edge case). For notifications with `postId == null` (deleted post/follow), handle navigation gracefully.
- [ ] T024 Handle edge case: deleted target content (null postId). In notification click handler, if postId is null, show a sonner toast "This content is no longer available" and skip navigation. Otherwise wrap navigation in try/catch and show the same toast if target page returns 404.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — MUST complete first
- **Foundational (Phase 2)**: Depends on Phase 1 — MUST complete before US1-US4
- **US1 (Phase 3)**: Depends on Phase 1+2 — CAN start independently
- **US2 (Phase 4)**: Depends on Phase 1+2 — CAN start independently (different file than US1)
- **US3 (Phase 5)**: Depends on Phase 1+2 — CAN start independently (different file than US1/US2)
- **US4 (Phase 6)**: Depends on Phase 1+2 — CAN start independently (different file than US1-3)
- **US5 (Phase 7)**: Depends on Phase 1 — CAN start in parallel with US1-4
- **Polish (Phase 8)**: Depends on all desired stories being complete

### User Story Dependencies

- **US1 (View) ↔ US2-4 (Create notifications)**: No dependency. US1 can be tested with seeded data. US2-4 can be verified by checking the DB or via US1 when available.
- **US2 (Follow) ↔ US3 (Like) ↔ US4 (Comment)**: No dependencies between them — each hooks into a different existing action file.
- **US5 (Cleanup)**: No dependency on US1-4 — operates directly on the DB.

### Parallel Opportunities

- T001+T002 (schema + types) can run in parallel
- T004+T005 (create-notification + notification-lib) can run in parallel
- T006+T007+T008+T009 (all 4 read actions) can run in parallel
- T010+T011+T012 (all 3 components) have internal dependencies (T012 depends on T011 depends on T010) — must be sequential
- US2 (T014), US3 (T015), US4 (T016) can all run in parallel since they edit different files
- T017+T018+T019 (cleanup action + route + workflow) can all run in parallel
- T020+T021+T022 can run in parallel (migration, manual validation, docs)
- T023+T024 (edge cases) can run in parallel

---

## Parallel Example: Notification Feature

```bash
# Phase 2 — Launch shared utils in parallel:
Task: "Create createNotification utility in src/features/notifications/utils/create-notification.ts"
Task: "Create notification-lib in src/features/notifications/utils/notification-lib.ts"

# Phase 3-6 — Launch all action files in parallel (different files):
Task: "Create get-notifications action in src/features/notifications/actions/get-notifications.ts"
Task: "Create mark-read action in src/features/notifications/actions/mark-read.ts"
Task: "Create mark-all-read action in src/features/notifications/actions/mark-all-read.ts"
Task: "Create get-unread-count action in src/features/notifications/actions/get-unread-count.ts"

# Phase 4-7 — Launch all integration hooks in parallel:
Task: "Hook notification into follow action at src/features/follow/actions/follow-actions.ts"
Task: "Hook notification into like action at src/features/likes/actions/toggle-like.ts"
Task: "Hook notification into comment action at src/features/post-comments/actions/comments.ts"
Task: "Create cleanup API route at src/app/api/cron/cleanup-notifications/route.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (schema + types + migration)
2. Complete Phase 2: Foundational (createNotification + notification-lib)
3. Complete Phase 3: User Story 1 (actions + components + integration in nav)
4. **STOP and VALIDATE**: Seed notifications via psql, test bell + panel manually
5. At this point you have a working notification viewer — deploy/demo if ready

### Incremental Delivery

1. **Setup + Foundational** → Foundation ready
2. **Add US1 (View)** → Users can see notifications (seed data manually) → Deliverable!
3. **Add US2 (Follow)** → Follows generate live notifications → Deliverable!
4. **Add US3 (Like)** → Likes generate live notifications → Deliverable!
5. **Add US4 (Comment)** → Comments generate live notifications → Full notification system!
6. **Add US5 (Cleanup)** → Automatic cleanup operational → Complete!

### Parallel Team Strategy

With multiple developers:

1. **Everyone**: Complete Phase 1+2 together (small phase)
2. **Developer A**: US1 — View/manage notification UI (actions + components)
3. **Developer B**: US2 — Follow notification integration
4. **Developer C**: US3 — Like notification integration
5. **Developer A or D**: US4 — Comment notification integration
6. **Anyone**: US5 — Cleanup cron (can be done anytime after Phase 1)
7. **Everyone**: Polish tasks

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to the user story from spec.md
- Each user story is independently completable and testable
- US1 does NOT require US2-4 to function — seed test data in DB
- US2-4 do NOT require US1 to function — create notifications can be verified via DB query or curl
- The `createNotification` utility handles the self-action (FR-004) guard — integration hooks just call it
- No test tasks included (not requested in spec)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
