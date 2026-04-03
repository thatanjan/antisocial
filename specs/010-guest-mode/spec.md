# Feature Specification: Guest Mode for Anonymous Users

**Feature Branch**: `010-guest-mode`
**Created**: Thu Apr 02 2026
**Status**: Draft
**Input**: User description: "Implement guest mode for anonymous user. User can take the full experience of the app without login. They can enter to guest mode from login page"

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

### User Story 2 - Browse Content as Guest (Priority: P1)

As a guest user, I want to view posts, user profiles, and explore the app so I can understand the platform before deciding to register.

**Why this priority**: Core value proposition of guest mode is letting users experience the content.

**Independent Test**: Can be fully tested by entering guest mode and verifying all read-only content is accessible.

**Acceptance Scenarios**:

1. **Given** I am a guest user, **When** I visit the feed, **Then** I can see posts from all users
2. **Given** I am a guest user, **When** I click on a post, **Then** I can view the post details and comments
3. **Given** I am a guest user, **When** I click on a user's name, **Then** I can view their public profile
4. **Given** I am a guest user, **When** I search for users or posts, **Then** I can see search results

---

### User Story 3 - Convert to Registered User (Priority: P2)

As a guest user, I want to convert my session to a registered account so I can save my activity and engage with the community.

**Why this priority**: Critical for turning guest users into registered users, driving platform growth.

**Independent Test**: Can be fully tested by entering guest mode, then clicking "Sign up with Google" and verifying the guest session is linked to the new account.

**Acceptance Scenarios**:

1. **Given** I am a guest user, **When** I click "Sign up with Google", **Then** I complete Google OAuth and my guest session converts to a registered account
2. **Given** I am a guest user, **When** I sign up after browsing, **Then** my prior session activity is preserved (if applicable)

---

### User Story 4 - Sign Out from Guest Mode (Priority: P2)

As a guest user, I want to exit guest mode so I can start fresh or proceed with registration.

**Why this priority**: Provides user control over their session state.

**Independent Test**: Can be fully tested by entering guest mode, clicking "Exit Guest Mode", and verifying redirection to login page.

**Acceptance Scenarios**:

1. **Given** I am a guest user, **When** I click "Exit Guest Mode" in the profile menu, **Then** my guest session is cleared and I am redirected to the login page

---

### User Story 5 - Restricted Actions for Guests (Priority: P1)

As a guest user, I want to see clear indicators that I cannot perform certain actions so I understand the limitations of my session.

**Why this priority**: Prevents user frustration by managing expectations upfront.

**Independent Test**: Can be fully tested by verifying action buttons are disabled or show appropriate messaging.

**Acceptance Scenarios**:

1. **Given** I am a guest user, **When** I try to create a post, **Then** I see a prompt to register before posting
2. **Given** I am a guest user, **When** I try to like a post, **Then** I see a prompt to register before liking
3. **Given** I am a guest user, **When** I try to comment on a post, **Then** I see a prompt to register before commenting
4. **Given** I am a guest user, **When** I try to follow a user, **Then** I see a prompt to register before following

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
- **FR-004**: System MUST display a guest avatar and "Guest" username in the navigation
- **FR-005**: System MUST persist guest session within browser session (survives page refresh)
- **FR-006**: System MUST expire guest session when browser is closed
- **FR-007**: System MUST prevent guests from creating posts, comments, or likes
- **FR-008**: System MUST show registration prompts when guests attempt restricted actions
- **FR-009**: System MUST allow guests to convert their session to a registered account via Google OAuth
- **FR-010**: System MUST provide an "Exit Guest Mode" option to clear the session
- **FR-011**: System MUST redirect to login page after exiting guest mode

### Key Entities

- **GuestSession**: Represents a temporary anonymous session. Attributes: sessionId, createdAt, expiresAt
- **GuestUser**: A placeholder user object displayed in the UI. Attributes: id, displayName ("Guest"), avatar

## Success Criteria

### Measurable Outcomes

- **SC-001**: Guests can access the feed and view content within 3 seconds of clicking "Continue as Guest"
- **SC-002**: Guest sessions persist correctly across page refreshes (100% session retention rate during browser session)
- **SC-003**: Guest sessions expire immediately upon browser closure
- **SC-004**: 100% of restricted actions show appropriate registration prompts
- **SC-005**: Guest-to-registered conversion flow completes without data loss
- **SC-006**: Exit Guest Mode successfully clears session and redirects within 1 second
