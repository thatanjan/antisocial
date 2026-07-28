# Feature Specification: Notification System

**Feature Branch**: `015-notification-system`
**Created**: 2026-07-28
**Status**: Draft
**Input**: User description: "build notification system - when someone follows, like & comment, send notification to user - delete notification after 30day - use cronjob(maybe pg_cron)"

## User Scenarios & Testing

### User Story 1 - View and manage notifications (Priority: P1)

As an authenticated user, I want to see a list of my recent notifications so I can stay informed about interactions with my content and profile.

**Why this priority**: This is the primary delivery mechanism — without a way to view notifications, the system provides no value to users.

**Independent Test**: Can be fully tested by logging in, triggering a notification event (follow, like, or comment), and verifying the notification appears in the user's notification list. Delivers the core value of the notification system.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I navigate to my notifications, **Then** I see a list of my unread and read notifications sorted by most recent first
2. **Given** I have notifications in my list, **When** I click on a notification, **Then** I am taken to the relevant content (the post that was liked/commented, or the profile of the user who followed me)
3. **Given** I have viewed a notification, **When** I return to the notification list, **Then** the notification is marked as read

---

### User Story 2 - Receive follow notification (Priority: P1)

As an authenticated user, when someone follows me, I want to receive a notification so I know about my new follower.

**Why this priority**: Follow notifications are one of the three core notification types specified and represent social validation signals that drive engagement.

**Independent Test**: Can be fully tested by User A following User B, then checking that User B receives a notification with the correct content ("User A started following you").

**Acceptance Scenarios**:

1. **Given** User A is not following User B, **When** User A follows User B, **Then** User B receives a notification indicating User A followed them
2. **Given** User A already follows User B, **When** there is no new follow/unfollow action, **Then** no duplicate follow notification is created
3. **Given** User A unfollows and refollows User B, **When** the follow action occurs again, **Then** User B receives a new follow notification

---

### User Story 3 - Receive like notification (Priority: P1)

As an authenticated user, when someone likes my post, I want to receive a notification so I know my content is being appreciated.

**Why this priority**: Like notifications are a core engagement signal and one of the three specified notification types.

**Independent Test**: Can be fully tested by User A liking User B's post, then verifying User B receives a notification. Can be demonstrated independently of follow and comment notifications.

**Acceptance Scenarios**:

1. **Given** User B has a published post, **When** User A likes that post, **Then** User B receives a notification indicating User A liked their post
2. **Given** User A has already liked User B's post, **When** User A toggles the like off and on again, **Then** User B receives only one notification for the re-like (no duplicate)
3. **Given** multiple users like the same post, **When** each like occurs, **Then** the post owner receives a separate notification for each unique liker

---

### User Story 4 - Receive comment notification (Priority: P1)

As an authenticated user, when someone comments on my post, I want to receive a notification so I can engage in the conversation.

**Why this priority**: Comment notifications drive conversation and return visits — essential for social platform engagement.

**Independent Test**: Can be fully tested by User A commenting on User B's post, then verifying User B receives a notification with the comment preview.

**Acceptance Scenarios**:

1. **Given** User B has a published post, **When** User A comments on that post, **Then** User B receives a notification indicating User A commented on their post
2. **Given** User A comments on their own post, **When** the comment is created, **Then** no notification is generated (self-activity does not notify oneself)
3. **Given** User A comments multiple times on the same post, **When** each comment is made, **Then** the post owner receives a separate notification for each comment

---

### User Story 5 - Automatic notification cleanup (Priority: P2)

As a system administrator, I want notifications older than 30 days to be automatically deleted so the database does not grow unboundedly.

**Why this priority**: This is an operational requirement that prevents data bloat but does not affect the core user-facing feature. It can be implemented after the notification creation and display are functional.

**Independent Test**: Can be fully tested by creating a notification with a timestamp older than 30 days, running the cleanup job, and verifying the old notification is removed while newer notifications are preserved.

**Acceptance Scenarios**:

1. **Given** there are notifications older than 30 days, **When** the scheduled cleanup runs, **Then** those notifications are permanently deleted
2. **Given** there are notifications younger than 30 days, **When** the scheduled cleanup runs, **Then** those notifications are preserved
3. **Given** the cleanup job runs successfully, **When** the job completes, **Then** a record of the cleanup activity is logged

### Edge Cases

- What happens when the user who triggered the notification (the actor) deletes their account? The notification should still be visible to the recipient but display "Deleted User" or similar placeholder.
- How does the system handle bulk notification creation (e.g., a popular user receives hundreds of likes in a short period)? Notifications should be created efficiently without blocking the user action.
- What happens when the target content (post) is deleted before the notification is viewed? Clicking the notification should gracefully handle the missing content (e.g., "This post has been deleted").
- What happens if the cleanup job fails (e.g., database connection issue)? The job should retry on the next scheduled run, and failures should be logged.

## Requirements

### Functional Requirements

- **FR-001**: System MUST automatically create a notification when User A follows User B
- **FR-002**: System MUST automatically create a notification when User A likes User B's post
- **FR-003**: System MUST automatically create a notification when User A comments on User B's post
- **FR-004**: Notifications MUST NOT be created for self-actions (following oneself, liking/commenting on own post)
- **FR-005**: Duplicate notifications for the same action MUST NOT be created (e.g., repeated like toggles should not create multiple notifications)
- **FR-006**: Users MUST be able to view a chronological list of their notifications, sorted newest first
- **FR-007**: Notifications MUST have a read/unread status that can be toggled by the recipient
- **FR-008**: Clicking a notification MUST navigate the user to the relevant content (post, user profile)
- **FR-009**: Notifications older than 30 days MUST be automatically and permanently deleted
- **FR-010**: The cleanup process MUST run on a recurring schedule automatically
- **FR-011**: The cleanup process MUST NOT delete notifications that are less than 30 days old
- **FR-012**: The notification list MUST show the actor's name, the action type, and (for comments) a preview of the comment text

### Key Entities

- **Notification**: Represents a single notification event. Contains information about who performed the action (actor), the type of action (follow, like, comment), the recipient, the target content reference (post or user profile), read status, and timestamp.
- **NotificationType**: Categorizes the notification as one of: follow, like, or comment. This determines the display template and the target link behavior.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can view all their notifications within 2 seconds of navigating to the notification view
- **SC-002**: Notification creation completes in under 500ms from the triggering action
- **SC-003**: The cleanup job removes 100% of notifications past the 30-day retention period on each scheduled run
- **SC-004**: The cleanup job completes within 5 minutes for up to 1 million notification records
- **SC-005**: Users can distinguish read from unread notifications at a glance

## Assumptions

- Users have an existing profile page and post system that can be linked to from notifications
- Authentication is required — only logged-in users receive and view notifications
- The existing user profile system stores follower relationships that can be observed for notification triggers
- The existing post system records likes and comments that can be observed for notification triggers
- Notifications are delivered in-app only (no email, SMS, or push notifications in scope for v1)
- Self-actions (liking/commenting on own content, following oneself) do not generate notifications
- The 30-day retention period starts from the notification creation timestamp
- The cleanup schedule runs at least once per day
- If the preferred scheduling mechanism (pg_cron) is unavailable, an alternative scheduler (e.g., OS cron, application-level scheduler) can be used to achieve the same outcome
