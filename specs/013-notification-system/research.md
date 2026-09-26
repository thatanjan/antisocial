# Research: Notification System

## Q1: What to use for cron job?

### Decision
Use **GitHub Actions scheduled workflow** for the 30-day notification cleanup, triggering a Next.js API route (`app/api/cron/cleanup-notifications/route.ts`).

### Rationale
- **No runtime dependency** — scheduling lives in the repo as a workflow file, not inside the app process. No `node-cron` package needed.
- **No Docker changes** — the API route runs inside the existing app container; GH Actions calls it externally.
- **Simple Prisma integration** — cleanup is a straightforward `deleteMany` query by `createdAt` filter.
- **Free, built-in scheduling** — GitHub Actions provides cron scheduling with 1-minute granularity at no cost for public/private repos.
- **Auditable** — the schedule, logs, and failures are visible in the GitHub Actions UI. No need to check app logs.
- **Works with any deployment** — Vercel, Railway, Docker, etc. Only requirement is the API route is publicly reachable.

### Local dev
Run the cleanup manually via curl against the local dev server:
```bash
curl "http://localhost:3000/api/cron/cleanup-notifications?secret=local-secret"
```

### Alternatives considered
- **`node-cron`**: Runs inside Next.js process, but unreliable with serverless deployments (cold starts, multiple instances). Also adds an npm dependency for something an external scheduler handles better.
- **pg_cron extension**: Requires custom Docker Postgres image and superuser DB privileges. Not portable across hosting providers.
- **setInterval in Next.js**: Unreliable with cold starts and multi-instance deployments.

### Architecture
1. GitHub Actions workflow runs on `schedule: cron('0 3 * * *')` — daily at 03:00 UTC
2. Workflow sends `GET` to `https://<deployed-url>/api/cron/cleanup-notifications?secret=${{ secrets.CRON_SECRET }}`
3. API route validates the secret and calls `prisma.notification.deleteMany({ where: { createdAt: { lt: thirtyDaysAgo } } })`
4. Workflow reports success/failure in GitHub Actions UI

---

## Q2: Schema for the notification table?

### Decision

```prisma
model Notification {
  id          String   @id @default(cuid())
  recipientId String
  actorId     String?
  type        String   // "follow" | "like" | "comment"
  read        Boolean  @default(false)

  // Polymorphic target: which content this notification links to
  targetType  String?  // "post" | "user"
  targetId    String?

  // Preview text (e.g., comment snippet)
  preview     String?  @db.VarChar(200)

  createdAt   DateTime @default(now())

  // Relations
  recipient   User     @relation("NotificationRecipient", fields: [recipientId], references: [id], onDelete: Cascade)
  actor       User?    @relation("NotificationActor", fields: [actorId], references: [id], onDelete: SetNull)

  @@index([recipientId, createdAt(sort: Desc)])
  @@index([recipientId, read])
  @@index([createdAt])
  @@map("notification")
}
```

### Rationale
- `actorId` is nullable with `onDelete: SetNull` — handles deleted-actor edge case (FR-004 note: show "Deleted User").
- `type` as a simple string enum — three values for v1. Using an enum string is simple and Prisma-friendly.
- Polymorphic `targetType`/`targetId` avoids separate `postId`/`followerId` nullable columns.
- `preview` is unique to comments (stores first ~200 chars). Null for follow/like.
- Compound indexes on `(recipientId, createdAt)` for the chronological list query, and `(recipientId, read)` for unread count.
- `createdAt` index for the cleanup `deleteMany` query.
- Relations to User for both recipient and actor allows JOIN-based queries rather than N+1 lookups.

---

## Q3: How to group notifications in the frontend?

### Decision
Flat chronological list grouped client-side by date bucket: **"Today"**, **"Yesterday"**, **"This Week"**, **"This Month"**, **"Older"**.

### Rationale
- **Simple data model** — no grouping/composite keys needed in the DB. The server returns a flat list ordered by `createdAt DESC`.
- **Client-side grouping** — date-fns bucket logic is trivial and works with the existing `date-fns` dependency.
- **Performance** — notifications are scoped to a single user, typically <1000, so client-side grouping has negligible cost.

### Display templates by type

| Type | Template | Target link | Preview |
|------|----------|-------------|---------|
| `follow` | "{actor} started following you" | `/profile/{actorId}` | — |
| `like` | "{actor} liked your post" | `/post/{targetId}` | — |
| `comment` | "{actor} commented: {preview}" | `/post/{targetId}" | First ~200 chars of comment |

### Notification grouping UI
- **Notification Bell**: Icon with a badge showing unread count, in the top navbar
- **Notification Panel**: Sheet/dropdown triggered by bell, shows date-grouped list
  - Each group has a date header
  - Unread items are visually distinct (bold/highlighted)
  - "Mark all as read" button at the top
  - "View all" link to full notifications page (future scope)
- **Individual item**: Avatar + notification text + relative timestamp ("2m ago", "1h ago")
  - Click navigates to target content AND marks as read

### Alternative considered
- **Server-side grouping with `GROUP BY`**: Over-engineered for flat notification model. Adds query complexity with no UX benefit since the data is per-user and small.
- **Push notifications / real-time**: Out of scope for v1 (per spec assumptions).
