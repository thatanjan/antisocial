# Data Model: Google Auth Page

This feature uses the standard **Better Auth** data model with a **Prisma** adapter, following the official Prisma documentation recommendations.

## Entities (Prisma Schema)

### User
Represents an authenticated user.
- `id`: String (Primary Key) @id
- `name`: String
- `email`: String (Unique) @@unique([email])
- `emailVerified`: Boolean
- `image`: String? (Avatar URL)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `sessions`: Session[] (Relation)
- `accounts`: Account[] (Relation)
- **Table Name**: `user` (@@map("user"))

### Session
Represents an active user session.
- `id`: String (Primary Key) @id
- `expiresAt`: DateTime
- `token`: String (Unique) @@unique([token])
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `ipAddress`: String?
- `userAgent`: String?
- `userId`: String (Foreign Key)
- `user`: User (Relation)
- **Table Name**: `session` (@@map("session"))

### Account
Represents a link between a User and an OAuth provider.
- `id`: String (Primary Key) @id
- `accountId`: String (External ID from Google)
- `providerId`: String (e.g., "google")
- `userId`: String (Foreign Key)
- `user`: User (Relation)
- `accessToken`: String?
- `refreshToken`: String?
- `idToken`: String?
- `accessTokenExpiresAt`: DateTime?
- `refreshTokenExpiresAt`: DateTime?
- `scope`: String?
- `password`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime
- **Table Name**: `account` (@@map("account"))

### Verification
Used for miscellaneous verification flows.
- `id`: String (Primary Key) @id
- `identifier`: String
- `value`: String
- `expiresAt`: DateTime
- `createdAt`: DateTime?
- `updatedAt`: DateTime?
- **Table Name**: `verification` (@@map("verification"))

## Relationships

- **User** has a 1-to-many relationship with **Account**.
- **User** has a 1-to-many relationship with **Session**.
- All relations use `onDelete: Cascade` to ensure data integrity when a user is deleted.
