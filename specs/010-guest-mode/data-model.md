# Data Model: Guest Mode

## Entity Changes

### User Model (Existing - Modified)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| isAnonymous | Boolean | No (default: false) | Indicates if user is a guest/anonymous user |

**Note**: This field is added to the existing User model in Prisma schema.

## New Types (TypeScript)

### GuestSession

```typescript
interface GuestSession {
  userId: string;
  isAnonymous: true;
  name: string;
  email: string;
  image?: string;
}
```

### GuestUser (UI Display)

```typescript
interface GuestUser {
  id: string;
  displayName: "Guest";
  handle: "@guest";
  avatar: string;
  isGuest: true;
}
```

## Data Flow

1. **Sign in as guest**: `authClient.signIn.anonymous()` creates User record with isAnonymous=true
2. **Session persistence**: Better Auth manages session via cookies (survives page refresh)
3. **Session expiry**: Cookie-based session expires when browser closes
4. **Account conversion**: When linking to Google account, isAnonymous field deleted with user record
5. **Exit guest mode**: Call `authClient.deleteAnonymousUser()` and redirect to login

## Validation Rules

- Guest users must have isAnonymous=true in database
- Guest email format: `temp-{randomId}@antisocial.app` (via emailDomainName option)
- Guest name: "Guest" (via generateName option or default)