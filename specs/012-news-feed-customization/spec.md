# Feature Specification: News Feed Final Customization

**Feature Branch**: `012-news-feed-customization`  
**Created**: 2026-06-21  
**Status**: Draft  
**Input**: User description: "news feed final customization - left & right sidebar should stay fix on scroll - request section remove - left sidebar - Explore My Favorites Direct Stats button disable. add title on hover 'coming soon'"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sidebars Stay Fixed While Scrolling Feed (Priority: P1)

A logged-in user browsing the news feed scrolls through posts in the main content area. The left and right sidebars remain fixed in place on screen, providing persistent access to navigation and suggestions without requiring the user to scroll back up.

**Why this priority**: This is a core UX improvement. Fixed sidebars are the expected behavior for content-heavy layouts; scrolling sidebars create a disjointed experience.

**Independent Test**: Can be fully tested by a user who loads the news feed, scrolls down the main content area, and verifies that both sidebars remain visible and unmoved in their original screen positions.

**Acceptance Scenarios**:

1. **Given** a logged-in user is viewing the news feed page, **When** they scroll the main content area downward, **Then** the left sidebar remains fixed in its original screen position.
2. **Given** a logged-in user is viewing the news feed page, **When** they scroll the main content area downward, **Then** the right sidebar remains fixed in its original screen position.
3. **Given** a logged-in user is viewing the news feed page on a mobile device, **When** they scroll, **Then** sidebar behavior follows the existing responsive layout (no change to mobile behavior).

---

### User Story 2 - Remove Requests Section from Right Sidebar (Priority: P2)

The right sidebar no longer displays a "Requests" section. Users see a cleaner right sidebar with search, suggestions, and footer links only.

**Why this priority**: Removing unused or unwanted UI sections reduces visual clutter and simplifies the layout.

**Independent Test**: Can be fully tested by loading the news feed page and verifying the "Requests" heading and any request items are absent from the right sidebar.

**Acceptance Scenarios**:

1. **Given** a logged-in user views the news feed page, **When** the right sidebar is rendered, **Then** no "Requests" heading or request items appear in the sidebar.
2. **Given** a user has pending social requests, **When** they view the right sidebar, **Then** no requests are shown (the section is fully removed, not just hidden).

---

### User Story 3 - Disable Placeholder Navigation Items with Tooltips (Priority: P2)

"Explore", "My Favorites", "Direct", and "Stats" navigation items in the left sidebar appear visually disabled (non-interactive) and display a tooltip reading "coming soon" when the user hovers over them. The "Feed" and "Settings" items remain fully functional.

**Why this priority**: Communicates to users that these features are planned but not yet available, reducing confusion and preventing navigation to non-existent pages.

**Independent Test**: Can be fully tested by hovering over each of the four disabled items and verifying the tooltip appears, and clicking them results in no navigation.

**Acceptance Scenarios**:

1. **Given** a logged-in user views the left sidebar, **When** they hover over "Explore", **Then** a tooltip appears reading "coming soon" and the item does not navigate when clicked.
2. **Given** a logged-in user views the left sidebar, **When** they hover over "My Favorites", **Then** a tooltip appears reading "coming soon" and the item does not navigate when clicked.
3. **Given** a logged-in user views the left sidebar, **When** they hover over "Direct", **Then** a tooltip appears reading "coming soon" and the item does not navigate when clicked.
4. **Given** a logged-in user views the left sidebar, **When** they hover over "Stats", **Then** a tooltip appears reading "coming soon" and the item does not navigate when clicked.
5. **Given** a logged-in user views the left sidebar, **When** they hover over or click "Feed" or "Settings", **Then** they remain fully functional as before.

---

### Edge Cases

- **What happens when the viewport height is very short?** The fixed sidebars should not overflow or cover the main content; they should remain constrained to screen height.
- **What happens on mobile or tablet where sidebars are hidden?** No behavior change — fixed positioning only applies to the existing sidebar breakpoints (md: for left, xl: for right).
- **What if a disabled nav item has an active route state?** Disabled items should never show as active, even if the URL matches their href.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Left sidebar MUST remain fixed on screen while the main content area scrolls, at the same breakpoint where it is currently visible.
- **FR-002**: Right sidebar MUST remain fixed on screen while the main content area scrolls, at the same breakpoint where it is currently visible.
- **FR-003**: The "Requests" section MUST be removed from the right sidebar entirely.
- **FR-004**: The "Explore", "My Favorites", "Direct", and "Stats" navigation items in the left sidebar MUST appear visually disabled.
- **FR-005**: Hovering over any disabled navigation item MUST display a tooltip with the text "coming soon".
- **FR-006**: Clicking a disabled navigation item MUST NOT trigger navigation or change the current page.
- **FR-007**: The "Feed" and "Settings" navigation items MUST remain fully functional and unaffected by these changes.
- **FR-008**: The disabled items MUST also appear disabled and non-interactive in the mobile navigation drawer (if they are listed there).

### Key Entities

- **Nav Item**: A single entry in the sidebar's navigation menu with a label, href, icon, and an optional disabled state with tooltip text.
- **Sidebar**: A fixed-position panel on the left or right side of the layout that contains navigation, search, suggestions, and footer links.
- **Requests Section**: A UI section in the right sidebar showing incoming social/follow requests (to be removed).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both sidebars remain fully visible and fixed in position when scrolling through at least 3 full viewport-heights of feed content.
- **SC-002**: No "Requests" heading or request items appear in the right sidebar under any conditions.
- **SC-003**: All four disabled nav items display "coming soon" tooltip on hover and do not navigate on click, verified for each item.
- **SC-004**: The "Feed" and "Settings" nav items continue to navigate correctly after the changes.
- **SC-005**: The page layout shows no visual regressions (broken alignment, overlapping elements, or missing sections) compared to the previous design.

## Assumptions

- The sidebars already use `sticky top-0` positioning; if this approach is insufficient for true fixed positioning, an alternative (e.g., `position: fixed`) may be used.
- The existing responsive breakpoints for sidebars (md: for left, xl: for right) are correct and should not change.
- The "Feed" and "Settings" items are the only navigation items that should remain active; any future nav items added should also be functional but are out of scope.
- Disabled nav items in the mobile navigation drawer should also be disabled for consistency.
