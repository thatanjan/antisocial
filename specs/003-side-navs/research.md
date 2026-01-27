# Research: Application Side Navigations

## Decision 1: Navigation Structure & Layout Groups
- **Decision**: Use a Next.js Layout Group `(authenticated)` to wrap the main application routes where sidebars are required.
- **Rationale**: This allows us to define a specific `layout.tsx` for logged-in views that includes the Sidebars, while keeping the root layout clean for public pages (landing, login).
- **Alternatives considered**: Conditional rendering in the root layout based on auth state. Rejected because Layout Groups provide better separation of concerns and avoid layout shifts/flashes on public routes.

## Decision 2: Responsive Sidebar Implementation
- **Decision**: 
    - **Desktop**: Persistent sticky sidebars.
    - **Mobile**: Use Shadcn `Sheet` (Drawer) components triggered by a hamburger menu in a top navbar (or separate trigger).
- **Rationale**: Standard modern UX for social apps. Sidebars take too much space on mobile; `Sheet` provides a consistent slide-out experience.
- **Alternatives considered**: Collapsible "icon-only" sidebar on mobile. Rejected because navigation labels are important for usability on smaller screens.

## Decision 3: Component Splitting
- **Decision**: Create a `navigation` feature folder.
    - `src/features/navigation/components/LeftSidebar.tsx`
    - `src/features/navigation/components/RightSidebar.tsx`
    - `src/features/navigation/components/ProfileSummary.tsx`
    - `src/features/navigation/components/NavLinks.tsx`
    - `src/features/navigation/components/SocialRequests.tsx`
    - `src/features/navigation/components/UserSuggestions.tsx`
- **Rationale**: Follows the modular component requirement and the project constitution's feature-based structure.
- **Alternatives considered**: Putting everything in global `src/components`. Rejected because these are specific to the "navigation/dashboard" feature.

## Decision 4: Dummy Data Strategy
- **Decision**: Create a `src/features/navigation/utils/mock-data.ts` to host all placeholder objects.
- **Rationale**: Centralizes dummy data, making it easy to swap with real data or API calls in the future without touching component logic.
