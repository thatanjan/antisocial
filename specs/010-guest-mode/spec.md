# Feature Specification: Guest Mode for Anonymous Users

**Feature Branch**: `010-guest-mode`
**Created**: Thu Apr 02 2026
**Status**: Draft
**Input**: User description: "Implement guest mode for anonymous user. User can take the full experience of the app without login, including creating posts, liking, commenting, and following. They can enter guest mode from login page"

## User Scenarios & Testing

### User Story 1 - Enter App as Guest (Priority: P1)

As an anonymous visitor, I want to access the app without creating an account so I can explore the content before committing to registration.

**Why this priority**: This is the primary entry point for guest users. Without this, no guest experience is possible.

**Independent Test**: Can be fully tested by visiting the login page, clicking "Continue as Guest", and verifying the user lands on the feed with read-only access.

**Acceptance Scenarios**:

1. **Given** I am on the login page, **When** I click "Continue as Guest", **Then** I am redirected to the feed page as a guest user
2. **Given** I am a guest user, **When** I view the navigation, **Then** I see a guest avatar and "Guest" as my display name
3. **Given** I am a guest user, **When** I refresh the page, **Then** my guest session persists and I remain logged in as a guest
4. **Given** I am a guest user, **When** I close and reopen the browser, **Then** my guest session expires and I need to enter guest mode again

---

### User Story 2 - Full App Experience as Guest (Priority: P1)

As a guest user, I want to use the full app functionality so I can experience everything before deciding to register.

**Why this priority**: Core value proposition of guest mode is letting users experience all features.

**Independent Test**: Can be fully tested by entering guest mode and verifying all app features are accessible.

**Acceptance Scenarios**:

1. **Given** I am a guest user, **When** I visit the feed, **Then** I can see posts from all users
2. **Given** I am a guest user, **When** I click on a post, **Then** I can view the post details and comments
3. **Given** I am a guest user, **When** I click on a user's name, **Then** I can view their public profile
4. **Given** I am a guest user, **When** I search for users or posts, **Then** I can see search results
5. **Given** I am a guest user, **When** I create a post, **Then** the post is created successfully
6. **Given** I am a guest user, **When** I like a post, **Then** the like is registered
7. **Given** I am a guest user, **When** I comment on a post, **Then** the comment is posted
8. **Given** I am a guest user, **When** I follow a user, **Then** the follow is registered

---

### Edge Cases

- What happens when the guest session expires during an active session?
- How does the system handle concurrent guest sessions from the same browser?
- What happens if a guest tries to access a direct link to a create post page?

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a "Continue as Guest" button on the login page
- **FR-002**: System MUST create a temporary guest session when user enters guest mode
- **FR-003**: System MUST allow guests to view posts, comments, and user profiles
- **FR-004**: System MUST allow guests to create posts, likes, comments, and follows
- **FR-005**: System MUST display a guest avatar and "Guest" username in the navigation
- **FR-006**: System MUST persist guest session within browser session (survives page refresh)
- **FR-007**: System MUST expire guest session when browser is closed
- **FR-008**: System MUST delete anonymous users after 48 hours of inactivity via cron job

### Key Entities

- **GuestSession**: Represents a temporary anonymous session. Attributes: sessionId, createdAt, expiresAt
- **GuestUser**: A placeholder user object displayed in the UI. Attributes: id, displayName ("Guest"), avatar

## Success Criteria

### Measurable Outcomes

- **SC-001**: Guests can access the feed and view content within 3 seconds of clicking "Continue as Guest"
- **SC-002**: Guest sessions persist correctly across page refreshes (100% session retention rate during browser session)
- **SC-003**: Guest sessions expire immediately upon browser closure
- **SC-004**: Cron job successfully deletes anonymous users inactive for 48 hours
