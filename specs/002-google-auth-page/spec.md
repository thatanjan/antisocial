# Feature Specification: Google Auth Page

**Feature Branch**: `002-google-auth-page`  
**Created**: 2026-01-23  
**Status**: Draft  
**Input**: User description: "Build auth page. For this social media app build the authentication page where user can login with google. Google oauth will be only login option. Page design is the attached image. The entire app will have theme switcher. Page should be responsive with mobile first approach."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Google Authentication (Priority: P1)

As a user, I want to log in using my Google account so that I can access the "antisocial" network without creating a new password.

**Why this priority**: Core functionality of the page. Without this, the app is inaccessible.

**Independent Test**: Can be tested by clicking the "Continue with Google" button and verifying it redirects to the Google OAuth consent screen.

**Acceptance Scenarios**:

1. **Given** the user is on the auth page, **When** they click "Continue with Google", **Then** they are redirected to Google's authentication service.
2. **Given** the user has successfully authenticated via Google, **When** they return to the app, **Then** they are logged in and redirected to the main dashboard (or home page).

---

### User Story 2 - Theme Switching (Priority: P1)

As a user, I want to toggle between light and dark modes so that I can choose the visual experience that best suits my environment.

**Why this priority**: Required for accessibility and user preference across the entire application.

**Independent Test**: Click the theme switcher icon and verify the page colors change immediately.

**Acceptance Scenarios**:

1. **Given** the app is in light mode, **When** the user clicks the theme switcher icon, **Then** the app switches to dark mode.
2. **Given** the app is in dark mode, **When** the user clicks the theme switcher icon, **Then** the app switches to light mode.

---

### User Story 3 - Responsive Design (Priority: P1)

As a mobile user, I want the auth page to look beautiful and be fully functional on my phone so that I can log in on the go.

**Why this priority**: Mobile-first approach is a core requirement.

**Independent Test**: View the page on various screen sizes (mobile, tablet, desktop) and verify the layout adjusts correctly.

**Acceptance Scenarios**:

1. **Given** a mobile screen width, **When** the page loads, **Then** the card and text are centered and properly scaled for the small screen.
2. **Given** a desktop screen width, **When** the page loads, **Then** the layout matches the provided minimalist design template.

---

### Edge Cases

- **What happens if Google OAuth fails?**
  - The system should display a user-friendly error message (e.g., "Authentication failed. Please try again.") and allow the user to retry.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display the "antisocial" logo/text in the specified font style.
- **FR-002**: The system MUST display the subtitle "JOIN THE QUIET." below the logo.
- **FR-003**: The system MUST provide a central card containing the "Continue with Google" button.
- **FR-004**: The "Continue with Google" button MUST feature the official Google logo.
- **FR-005**: The system MUST initiate a Google OAuth2 flow when the login button is clicked.
- **FR-006**: The system MUST include a persistent theme switcher (light/dark mode) accessible on the auth page.
- **FR-007**: The system MUST display the catchy text "Escape the noise. Join the quiet." below the login button.
- **FR-008**: The system MUST include a "TERMS OF SERVICE" link in the footer.
- **FR-009**: The UI MUST be responsive and follow a mobile-first design pattern.

### Key Entities *(include if feature involves data)*

- **User**: Represents the person attempting to authenticate. Key attributes: Google ID, Email, Name, Avatar URL.
- **Session**: Represents the active authenticated state of the user.

## Assumptions & Dependencies

- **Assumption**: The Google OAuth client ID and secret will be provided in the environment configuration.
- **Assumption**: The "invitation list" logic (if any) is handled by the backend and does not impact the basic UI layout of the auth page.
- **Dependency**: Requires a functioning Google Cloud Project for OAuth credentials.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach the Google OAuth consent screen within 2 clicks from landing on the page.
- **SC-002**: Theme switching (light to dark and vice versa) occurs in under 100ms.
- **SC-003**: The page passes accessibility checks for color contrast in both light and dark modes.
- **SC-004**: The page layout remains consistent and usable on screen widths from 320px to 1920px.
