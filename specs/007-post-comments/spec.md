# Feature Specification: Post Comments and Replies

**Feature Branch**: `007-post-comments`  
**Created**: 2026-03-07  
**Status**: Draft  
**Input**: User description: "add comments to post. - user can add, update, delete comment to post - total comment should be visible in the posts page - clicking on the comment icon the post card take you to post page. - on post page add an input box should be shown for adding comments - People can like comments. - people can reply to comment - Adding reply can be done with 1 layer. For example, you can reply to a comment but you cannot reply to reply. - There will be only 5 comments displayed at first. if more comments available, a load more button should be visisble to load 5 more comments. same thing for replies"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Commenting (Priority: P1)

As a user, I want to add comments to a post and see the total count on the post card so that I can interact with the content and see its popularity.

**Why this priority**: Core engagement feature. Without this, the social aspect is limited.

**Independent Test**: Can be fully tested by adding a comment on the post page and verifying the count updates on the post card.

**Acceptance Scenarios**:

1. **Given** a user is on a post's detail page, **When** they type a comment in the input box and submit, **Then** the comment is added to the list and the total count increments.
2. **Given** a user is viewing the post feed, **When** they look at a post card, **Then** they see the correct total number of comments.
3. **Given** a post card in the feed, **When** the user clicks the comment icon, **Then** they are navigated to the post detail page.

---

### User Story 2 - Comment Management (Priority: P1)

As a comment author, I want to edit or delete my comments so that I can correct mistakes or remove content I no longer want to share.

**Why this priority**: Basic user control over their own content is essential for a good experience.

**Independent Test**: Can be tested by creating a comment, then using the edit/delete controls to modify or remove it.

**Acceptance Scenarios**:

1. **Given** a user is the author of a comment, **When** they select the "edit" option, **Then** they can modify the text and save changes.
2. **Given** a user is the author of a comment, **When** they select the "delete" option, **Then** the comment is removed from the post.

---

### User Story 3 - Comment Interaction (Priority: P2)

As a user, I want to like comments and reply to others' comments so that I can participate in discussions and show appreciation for specific thoughts.

**Why this priority**: Enhances engagement and community interaction.

**Independent Test**: Can be tested by clicking "like" on a comment (verifying count increases) and adding a reply to an existing comment.

**Acceptance Scenarios**:

1. **Given** a comment exists, **When** a user clicks the "like" button, **Then** the like count increments.
2. **Given** a comment exists, **When** a user clicks "reply", **Then** they can enter a reply that appears underneath the parent comment.
3. **Given** a reply exists, **When** a user looks for a "reply" option on that reply, **Then** no such option is available (limit to 1 layer).

---

### User Story 4 - Pagination and Persistence (Priority: P3)

As a user, I want to see a limited number of comments initially with the ability to load more so that the page remains performant even with many comments.

**Why this priority**: Performance and UX optimization for long threads.

**Independent Test**: Can be tested on a post with >5 comments and >5 replies by verifying the "load more" button appears and functions.

**Acceptance Scenarios**:

1. **Given** a post has more than 5 comments, **When** the post page loads, **Then** only the 5 most recent comments are shown with a "load more" button.
2. **Given** a comment has more than 5 replies, **When** the replies are displayed, **Then** only 5 are shown with a "load more" button.
3. **Given** the "load more" button is visible, **When** clicked, **Then** 5 additional items are displayed.

### Edge Cases

- **Deleted Parent**: Deleting a parent comment automatically deletes all its replies (Cascade Delete).
- **Empty Content**: System MUST prevent submission of empty comments or replies.
- **Concurrent Updates**: If two users comment simultaneously, both should eventually see the updated count without refreshing.
- **Network Failure**: System should show an error message if the comment fails to save.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to add comments to a post.
- **FR-002**: System MUST allow users to update their own comments.
- **FR-003**: System MUST allow users to delete their own comments.
- **FR-004**: System MUST display the total comment count (comments + replies) on the post card.
- **FR-005**: System MUST navigate to the post detail page when the comment icon on a post card is clicked.
- **FR-006**: System MUST show an input box on the post detail page specifically for adding top-level comments.
- **FR-007**: System MUST allow users to toggle "Like" on comments (Like/Remove Like).
- **FR-008**: System MUST allow users to reply to a comment.
- **FR-009**: System MUST restrict replies to exactly 1 level deep (no replies to replies).
- **FR-010**: System MUST initially display only the 5 newest comments (Newest First).
- **FR-011**: System MUST provide a "load more" button if more than 5 higher-level comments exist.
- **FR-012**: System MUST initially display only 5 replies for any given comment (Newest First).
- **FR-013**: System MUST provide a "load more" button for replies if more than 5 exist for a parent comment.
- **FR-014**: System MUST NOT provide a dislike button for comments, maintaining a "Like-only" engagement model for this feature.
- **FR-015**: System MUST limit comment and reply content to a maximum of 2000 characters.

### Key Entities *(include if feature involves data)*

- **Comment**: Represents a user's response to a post. Includes content, author, timestamp, and like count.
- **Reply**: A specialized comment that is linked to a parent comment. Shares attributes with Comment but cannot be a parent itself.
- **Like**: Represents a user's appreciation for a comment or reply.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can post a comment in under 3 seconds from submission.
- **SC-002**: Total comment count on post cards updates within 2 seconds of a new comment being added.
- **SC-003**: 100% of "load more" clicks successfully fetch and display additional items if available.
- **SC-004**: No user is able to create a reply to a reply (strict 1-level enforcement).
