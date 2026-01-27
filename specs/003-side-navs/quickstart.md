# Quickstart: Application Side Navigations

## Overview
This feature implements the core application layout for authenticated users, featuring a three-column design with responsive sidebars.

## Feature Setup
1. **Layout Group**: Routes requiring the sidebars should be moved under `src/app/(authenticated)/`.
2. **Components**: The sidebar logic is contained within `src/features/navigation/`.
3. **Icons**: Uses `lucide-react` for all navigation and action icons.

## Running the UI
1. Ensure the development server is running: `npm run dev`.
2. Navigate to a route within the `(authenticated)` group (e.g., `/feed` or `/settings`).
3. Sidebars will be visible on Desktop (>1024px).
4. On Mobile (<1024px), use the Hamburger menu in the header to toggle the sidebars via the `Sheet` component.

## Components to Review
- `src/features/navigation/components/LeftSidebar.tsx`: Main navigation and profile summary.
- `src/features/navigation/components/RightSidebar.tsx`: Search and social panels.
- `src/features/navigation/components/MobileNav.tsx`: Hamburger menu and Sheet implementation.
