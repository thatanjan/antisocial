# Research: Guest Mode Implementation

## Better Auth Anonymous Plugin

### Decision: Use Better Auth's Built-in Anonymous Plugin

**Rationale**: The project already uses Better Auth for authentication. The anonymous plugin provides:
- Seamless integration with existing auth system
- Automatic account linking when user signs up with another provider
- Server and client-side API support
- Database schema support via isAnonymous flag

### Key Findings from Documentation

1. **Installation**: Add `anonymous()` to plugins in auth.ts
2. **Client**: Add `anonymousClient()` to auth client plugins
3. **Sign In**: `await authClient.signIn.anonymous()`
4. **Delete**: `await authClient.deleteAnonymousUser()`
5. **Email Domain**: Use `emailDomainName` option to customize guest email format
6. **Account Linking**: Automatic when user signs up with another provider; `onLinkAccount` callback available for custom logic
7. **Schema**: Requires `isAnonymous` boolean field on User table

### Alternatives Rejected

- **Custom session management**: Would require significant custom code to handle session persistence, expiry, and account linking
- **Third-party anonymous auth**: Unnecessary overhead since Better Auth provides this built-in

## Implementation Details

### Authentication Flow

1. User clicks "Continue as Guest" on login page
2. Modal confirms: "Your account will be deleted after 7 days of inactivity. You can convert to a permanent account later."
3. User confirms → `authClient.signIn.anonymous()` called
4. User redirected to feed with guest session
5. Profile shows "Guest" username with generic avatar
6. Exit Guest Mode available in profile menu

### Guest Limitations (per spec)

- Read-only access to feed, posts, comments, profiles
- Cannot create posts, comments, likes
- Cannot follow users
- Prompted to register when attempting restricted actions

### Account Conversion

When guest signs up with Google:
- Anonymous user activities preserved via Better Auth's automatic linking
- Anonymous user record deleted by default
- New user gets full access rights