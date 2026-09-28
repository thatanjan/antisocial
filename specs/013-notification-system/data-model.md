# Data Model: Notification

## Entity: `Notification`

Stores a single notification event targeting a specific user.

### Fields

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | `String` | No | `cuid()` | Primary key |
| `recipientId` | `String` | No | — | FK → User (who receives the notification) |
| `actorId` | `String?` | Yes | — | FK → User (who performed the action; null if deleted) |
| `type` | `String` | No | — | One of: `"follow"`, `"like"`, `"comment"` |
| `read` | `Boolean` | No | `false` | Whether recipient has viewed this notification |
| `targetType` | `String?` | Yes | — | One of: `"post"`, `"user"` (what was acted on) |
| `targetId` | `String?` | Yes | — | ID of the target (post ID or user ID) |
| `preview` | `String?` | Yes | — | For `"comment"` type: first 200 chars of the comment |
| `createdAt` | `DateTime` | No | `now()` | When the notification was created |

### Relations

- **recipient**: `User @relation("NotificationRecipient")` — `onDelete: Cascade`
- **actor**: `User? @relation("NotificationActor")` — `onDelete: SetNull`

### Indexes

1. `@@index([recipientId, createdAt(sort: Desc)])` — primary query: fetch user's notifications newest-first
2. `@@index([recipientId, read])` — unread count query
3. `@@index([createdAt])` — cleanup job: delete where createdAt < 30 days ago

### Validation Rules

- `type` MUST be one of: `"follow"`, `"like"`, `"comment"`
- `actorId` MUST differ from `recipientId` (enforced in application logic, not DB constraint)
- `preview` MUST NOT exceed 200 characters
- `targetType` MUST be present when `targetId` is present (and vice versa)
- `targetType` must be `"post"` for `like` and `comment` types
- `targetType` must be `"user"` for `follow` type

### State Transitions

- **Unread → Read**: Recipient views the notification (single or bulk mark-read action)
- **Read → (deleted)**: Automatic cleanup after 30 days from `createdAt`

### Prisma Schema

```prisma
model Notification {
  id          String   @id @default(cuid())
  recipientId String
  actorId     String?
  type        String   // "follow" | "like" | "comment"
  read        Boolean  @default(false)
  targetType  String?  // "post" | "user"
  targetId    String?
  preview     String?  @db.VarChar(200)
  createdAt   DateTime @default(now())

  recipient   User     @relation("NotificationRecipient", fields: [recipientId], references: [id], onDelete: Cascade)
  actor       User?    @relation("NotificationActor", fields: [actorId], references: [id], onDelete: SetNull)

  @@index([recipientId, createdAt(sort: Desc)])
  @@index([recipientId, read])
  @@index([createdAt])
  @@map("notification")
}
```

## Relationships to Existing Models

```
User (recipient) 1───* Notification
User (actor)    1───* Notification  (nullable, SetNull on delete)
```
