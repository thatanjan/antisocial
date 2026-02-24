# Feature Specification: Like Post

**Feature Branch**: `006-like-post`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "add like post. user can now like a post. user cannot like his own post. when clicking on like button, ui should update optimistically. on the background like should happen. if like fails, ui should update automatically and an error should be shown. dislike means removing a like."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Liking a Post (Priority: P1)

As an authenticated user, I want to like a post that I find interesting so that I can show my appreciation and increase its popularity.

**Why this priority**: Core interaction for engagement.

**Independent Test**: Can be tested by clicking the "Like" button on a post. The like status and count should update immediately and persist after refresh.

**Acceptance Scenarios**:

1. **Given** I am logged in and viewing a post authored by another user, **When** I click the "Like" button, **Then** the "Like" icon highlights immediately, and the like count increases by 1.
2. **Given** I have already liked a post, **When** I click the "Like" button again, **Then** the "Like" icon returns to its default state, and the like count decreases by 1.

---

### User Story 2 - Error Handling and Revert (Priority: P2)

As a user, I want the UI to correctly reflect the actual state when a like action fails on the server so that I am not misled about my action's success.

**Why this priority**: Essential for UX consistency when using optimistic updates.

**Independent Test**: Simulate a failed background request for a like action. Verify the UI reverts to the previous state and shows an error message.

**Acceptance Scenarios**:

1. **Given** I am logged in and click "Like" on a post, **When** the backend request fails, **Then** the UI reverts the "Like" state and count, and a notification shows "Failed to process like."

---

### Edge Cases

- **Own Post**: What happens when a user attempts to like their own post? (Requirement: Button is disabled or action is blocked).
- **Multiple Clicks**: How does the system handle rapid successive clicks? (Requirement: UI handles debouncing or optimistic state remains consistent with the final intent).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to "Like" any post that is not their own.
- **FR-002**: System MUST prevent users from liking their own posts.
- **FR-003**: System MUST provide optimistic UI updates for likes.
- **FR-004**: System MUST automatically revert the UI state and display an error if the background update fails.
- **FR-005**: System MUST provide toggle behavior: clicking an active Like removes it.
- **FR-006**: System MUST persist the "Liked" state for each user/post pair.

### Key Entities

- **Post**: Attributes include a stored `likeCount` for performance.
- **PostLikes**: Represents a specific user's interaction with a post. Attributes include User ID and Post ID.

## Assumptions & Dependencies

### Assumptions
- **Authentication**: Users must be authenticated to like.
- **Toggle Meaning**: "Dislike" (removing a like) is functionally identical to untoggling a Like.

### Dependencies
- **Post Service**: Existing system to display posts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: UI reflects the new "Like" state in under 100ms.
- **SC-002**: 100% of failed background like requests result in an automatic UI revert.
- **SC-003**: 0% of users can like their own post via the UI.
