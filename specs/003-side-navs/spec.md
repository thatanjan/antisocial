# Feature Specification: Application Side Navigations

**Feature Branch**: `003-side-navs`  
**Created**: 2026-01-27  
**Status**: Draft  
**Input**: User description: "build left and right side nav. the side navs will only be shown inside main app when users are loggedin. use image as design inspiration. Don't need to copy exactly. Use different component files and smaller. UI only, dummy data."

## Scope & Assumptions

- **UI-First Implementation**: The initial phase focuses exclusively on the visual implementation and layout of the side navigations.
- **Mock Data**: All user-specific data (profile details, stats, requests, suggestions) will be populated using static dummy data/placeholders.
- **No Backend Integration**: backend services, database queries, and real auth session handling are out of scope for this specific task.
- **Interaction simulation**: Buttons (Accept/Decline) and links will be functional in UI terms (e.g., hover states, console logs) but won't persist changes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticated Navigation Layout (Priority: P1)

As a logged-in user, I want to see a left sidebar with navigation links so that I can see the app's structure.

**Why this priority**: Core layout element for the main application view.

**Independent Test**: Can be tested by viewing the component in isolation or on a mock "authenticated" layout.

**Acceptance Scenarios**:

1. **Given** the component is rendered, **When** viewed on desktop, **Then** I should see a left sidebar containing "Feed", "Explore", "My Favorites", "Direct", "Stats", and "Settings" with dummy counts/badges if applicable.

---

### User Story 2 - Profile Summary Display (Priority: P2)

As a logged-in user, I want to see a dummy profile summary in the left sidebar.

**Why this priority**: Completes the visual design of the left sidebar.

**Acceptance Scenarios**:

1. **Given** the left sidebar is rendered, **When** looking at the profile section, **Then** I should see a placeholder avatar, a dummy name "John Doe", and placeholder counts for posts/followers.

---

### User Story 3 - Social Side Panel (Priority: P2)

As a logged-in user, I want to see a right sidebar with mock social information.

**Why this priority**: Necessary for the three-column layout look.

**Acceptance Scenarios**:

1. **Given** the main layout, **When** looking to the right, **Then** I should see a search bar and list items for Friend Requests and Suggestions using placeholder data.

---

### Edge Cases

- **Responsive Hiding**: Sidebars should hide gracefully on mobile screen sizes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a left sidebar with modular components for Navigation and Profile Summary.
- **FR-002**: System MUST display a right sidebar with modular components for Search, Requests, and Suggestions.
- **FR-003**: All components MUST use static dummy data for demonstration.
- **FR-004**: Sidebars MUST be responsive (e.g., sticky/fixed positioning on desktop, hidden on mobile).
- **FR-005**: Components MUST be split into small, manageable files as requested.

### Key Entities

- **MockUser**: Dummy object for profile display.
- **MockRequest**: Dummy object for social interactions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: UI layout matches the three-column structure inspired by the provided design image.
- **SC-002**: Each sidebar section (e.g., Suggestions) is a separate React/UI component file.
- **SC-003**: 0 backend errors (because 0 backend calls are made).
