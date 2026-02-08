# Feature Specification: Create Post

**Feature Branch**: `004-create-post`
**Created**: 2026-01-31
**Status**: Draft
**Input**: User description: create post - Users can create post - Post can have image or description or both - description can't be more then 1000 char. - images can be 16:9, 1:1, 4:5 - users should have option to select the ratio while upload - IMages should be optimzed on client side before uploading to server - maximum 10 images can be upload in one post - Images should be displayed as carousel - clicking on create post button should open a modal. - After creating post user will see a loading state in modal and then redirect to /post/id route - If failed don't cloase the modal, instead tell them it has some error in a snackbar - posts description should be collapsable and only first 2 lines will be visible

## User Scenarios & Testing

### User Story 1 - Create New Post (Priority: P1)

As a logged-in user, I want to create a new post with text and/or images so that I can share updates.

**Why this priority**: Core functionality of the platform.

**Independent Test**: Can be tested by clicking "Create Post", entering data, and submitting.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they click "Create Post", **Then** a modal opens.
2. **Given** the create post modal, **When** the user enters text (<= 1000 chars) and submits, **Then** the post is created and user is redirected to the post page.
3. **Given** the create post modal, **When** the user attempts to submit empty data (no text, no images), **Then** the submission is disabled or shows an error.
4. **Given** text longer than 1000 chars, **When** user types, **Then** they are prevented or warned (Input validation).
5. **Given** a network error during submission, **When** submitting, **Then** the modal remains open and a snackbar displays the error.

### User Story 2 - Image Upload & Optimization (Priority: P1)

As a user, I want to upload up to 10 images with specific aspect ratios and have them optimized so that uploads are fast and look good.

**Why this priority**: Visual content is key for engagement.

**Independent Test**: Upload images, verify optimization and constraints.

**Acceptance Scenarios**:

1. **Given** the create post modal, **When** user selects images, **Then** they can choose an aspect ratio (16:9, 1:1, 4:5) for the images.
2. **Given** selected images, **When** uploading, **Then** the images are optimized on the client side before network request.
3. **Given** the uploader, **When** user tries to select more than 10 images, **Then** the system prevents it or shows an error.
4. **Given** the aspect ratio selection, **When** user selects one (e.g., 16:9), **Then** all selected images are cropped/fitted to that ratio or the container enforces it. *Assumption: Ratio applies to the whole post or individual images? Description says "select the ratio", implying a choice. I will assume it applies to the batch or per image. Let's assume batch for simplicity unless specified.*

### User Story 3 - View Post (Priority: P1)

As a user, I want to view posts with carousels and collapsible text so that I can browse the feed efficiently.

**Why this priority**: Consumption experience.

**Independent Test**: View a created post.

**Acceptance Scenarios**:

1. **Given** a post with multiple images, **When** viewing the post, **Then** images are displayed in a carousel.
2. **Given** a post with description longer than 2 lines, **When** viewing, **Then** only the first 2 lines are visible initially with an option to expand.
3. **Given** a created post, **When** submission is successful, **Then** the user is redirected to `/post/[id]`.

## Edge Cases

- User navigates away while uploading/submitting (Prompt to save/discard?).
- Image format not supported (JPG/PNG only?).
- Very large images (Memory issues during optimization?).
- Failed optimization process.

## Assumptions

- Image aspect ratio selection applies to all images in the current batch upload.
- Supported image formats are standard web formats (JPEG, PNG, WebP).
- Client-side optimization capability is supported by the user's browser.

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow logged-in users to create posts with description, images, or both.
- **FR-002**: System MUST limit descriptions to 1000 characters.
- **FR-003**: System MUST allow uploading up to 10 images per post.
- **FR-004**: System MUST provide options for cropping/selecting image aspect ratios: 16:9, 1:1, 4:5.
- **FR-005**: System MUST optimize images on the client-side before upload to reduce size.
- **FR-006**: System MUST display images in a carousel on the post view.
- **FR-007**: System MUST truncate post descriptions to 2 lines with a "read more" / expand option in the UI.
- **FR-008**: The creation interface MUST be a modal.
- **FR-009**: System MUST show a loading state in the modal during the submission process.
- **FR-010**: On successful creation, System MUST redirect user to the new post's detail page `/post/<post_id>`.
- **FR-011**: On failure, System MUST keep the modal open and display the error message in a snackbar.

### Key Entities

- **Post**: ID, author_id, description (text), created_at, updated_at.
- **PostImage**: ID, post_id, url, aspect_ratio, order_index.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can successfully create a text post in under 30 seconds.
- **SC-002**: Client-side optimization reduces image file size by at least 20% on average.
- **SC-003**: 99% of valid post submissions result in a successful creation and redirect.
- **SC-004**: Error feedback (snackbar) appears within 500ms of a failed request.
