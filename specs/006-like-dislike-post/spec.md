# Feature Specification: Like and Dislike Post

**Feature Branch**: `006-like-dislike-post`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "add like and dislike post user can now like and dislike a post. user cannot like his own post. when clicking on like button , ui should update optimiisticly. on the background like should happen. if like or dislike failes, ui should update automatically and a error should be shown"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Liking a Post (Priority: P1)

As an authenticated user, I want to like a post that I find interesting so that I can show my appreciation and increase its popularity.

**Why this priority**: Core functionality of the feature. This is the primary way users interact with content.

**Independent Test**: Can be tested by clicking the "Like" button on a post authored by another user. The like status and count should update immediately and persist after refresh.

**Acceptance Scenarios**:

1. **Given** I am logged in and viewing a post authored by another user, **When** I click the "Like" button, **Then** the "Like" icon highlights immediately, and the like count increases by 1.
2. **Given** I have already liked a post, **When** I click the "Like" button again, **Then** the "Like" icon returns to its default state, and the like count decreases by 1.

---

### User Story 2 - Disliking a Post (Priority: P1)

As an authenticated user, I want to dislike a post that I find irrelevant or unhelpful so that I can express my opinion.

**Why this priority**: Complementary to liking, completes the primary interaction loop.

**Independent Test**: Can be tested by clicking the "Dislike" button on a post authored by another user. The dislike status and count should update immediately and persist after refresh.

**Acceptance Scenarios**:

1. **Given** I am logged in and viewing a post authored by another user, **When** I click the "Dislike" button, **Then** the "Dislike" icon highlights immediately, and the dislike count increases by 1.
2. **Given** I have already disliked a post, **When** I click the "Dislike" button again, **Then** the "Dislike" icon returns to its default state, and the dislike count decreases by 1.

---

### User Story 3 - Error Handling and Revert (Priority: P2)

As a user, I want the UI to correctly reflect the actual state when a like/dislike action fails on the server so that I am not misled about my action's success.

**Why this priority**: Essential for UX consistency when using optimistic updates.

**Independent Test**: Simulate a failed background request for a like action. Verify the UI reverts to the previous state and shows an error message.

**Acceptance Scenarios**:

1. **Given** I am logged in and click "Like" on a post, **When** the backend request fails (e.g., network error), **Then** the UI reverts the "Like" state and count, and a toast/notification shows "Failed to process like. Please try again."

---

### Edge Cases

- **Own Post**: What happens when a user attempts to like their own post? (Requirement: Button is disabled or action is blocked).
- **Mutually Exclusive Reactions**: What happens if a user clicks "Dislike" while they have already "Liked" the post? (Assumption: The "Like" is removed and "Dislike" is added).
- **Concurrent Updates**: How does the system handle two users liking a post at the exact same moment? (Requirement: Backend ensures atomic count increments).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to "Like" or "Dislike" any post that is not their own.
- **FR-002**: System MUST prevent users from reacting (Like/Dislike) to their own posts.
- **FR-003**: System MUST provide optimistic UI updates for reactions, reflecting the intended state immediately upon user click.
- **FR-004**: System MUST automatically revert the UI state and display a user-friendly error message if the background reaction update fails.
- **FR-005**: System MUST treat Like and Dislike as mutually exclusive; a user can have at most one reaction type active on a post at a time.
- **FR-006**: System MUST persist the reaction state (Like/Dislike/None) for each user/post pair.
- **FR-007**: System MUST provide a way for users to remove their reaction by clicking the active reaction button again (toggle behavior).

### Key Entities

- **Post**: Represents the content being reacted to. Attributes include like count and dislike count.
- **Reaction**: Represents a specific user's interaction with a post. Attributes include User ID, Post ID, and Type (Like or Dislike).

## Assumptions & Dependencies

### Assumptions
- **Authentication**: Users must be authenticated to perform Like/Dislike actions.
- **Mutual Exclusivity**: A user cannot "Like" and "Dislike" the same post simultaneously. Selecting one will remove the other.
- **Single Reaction**: A user can have at most one "Like" or one "Dislike" per post.
- **Global Visibility**: Reaction counts are visible to all users, but only authenticated users can modify their own reactions.

### Dependencies
- **Post Service**: Requires an existing system to manage and display posts.
- **Authentication Service**: Requires a system to identify and authorize users.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: UI reflects the new "Like" or "Dislike" state in under 100ms (optimistic update).
- **SC-002**: 100% of failed background reaction requests result in an automatic UI revert and error notification.
- **SC-003**: 0% of users are able to successfully "Like" or "Dislike" their own post via the UI.
- **SC-004**: Reaction state and counts are consistent across page reloads and different sessions for the same user.
