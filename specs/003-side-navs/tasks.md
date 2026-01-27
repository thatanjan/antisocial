# Tasks: Application Side Navigations

This document outlines the granular tasks required to implement the responsive sidebars using dummy data.

## Phase 1: Foundation & Mock Data

- [x] **Task 1.1: Feature Directory Setup**
  - Create the folder structure: `src/features/navigation/components/`, `src/features/navigation/utils/`, `src/features/navigation/types/`.
  - Add a blank `index.ts` in each if needed for organization.
- [x] **Task 1.2: Navigation Types**
  - Define `NavItem`, `MockUser`, and `SocialItem` interfaces in `src/features/navigation/types/index.ts` based on the data model.
- [x] **Task 1.3: Mock Data Implementation**
  - Create `src/features/navigation/utils/mock-data.ts`.
  - Populate it with dummy data for: current user, navigation links (Feed, Explore, etc.), friend requests, and suggestions.
- [x] **Task 1.4: Install Shadcn UI Components**
  - Install: `npx shadcn@latest add sheet scroll-area avatar input button`.

## Phase 2: Atomic Components

- [ ] **Task 2.1: Navigation Link Component**
  - Create `src/features/navigation/components/NavLinkItem.tsx`.
  - Implementation: Simple link with icon, label, and optional badge count.
- [ ] **Task 2.2: Profile Summary Component**
  - Create `src/features/navigation/components/ProfileSummary.tsx`.
  - Implementation: Displays avatar, name, location, and horizontal stats (Posts/Followers/Following).
- [ ] **Task 2.3: Social Request Item**
  - Create `src/features/navigation/components/SocialRequestItem.tsx`.
  - Implementation: User avatar, name, "Accept", and "Decline" buttons (mock functionality).
- [ ] **Task 2.4: User Suggestion Item**
  - Create `src/features/navigation/components/UserSuggestionItem.tsx`.
  - Implementation: User avatar, name, and "Follow" button.
- [ ] **Task 2.5: Search Bar Component**
  - Create `src/features/navigation/components/SearchBar.tsx`.
  - Implementation: Controlled Input with search icon.

## Phase 3: Sidebar Containers

- [ ] **Task 3.1: Left Sidebar Container**
  - Create `src/features/navigation/components/LeftSidebar.tsx`.
  - Implementation: Compose `ProfileSummary` and a list of `NavLinkItem`s inside a `ScrollArea`.
- [ ] **Task 3.2: Right Sidebar Container**
  - Create `src/features/navigation/components/RightSidebar.tsx`.
  - Implementation: Compose `SearchBar`, "Requests" section (list of `SocialRequestItem`), and "Suggestions" section.

## Phase 4: Layout & Responsiveness

- [ ] **Task 4.1: Mobile Navigation (Sheet)**
  - Create `src/features/navigation/components/MobileNav.tsx`.
  - Implementation: Use Shadcn `Sheet` to host the `LeftSidebar` and `RightSidebar` content behind a Hamburger menu trigger.
- [ ] **Task 4.2: Authenticated Layout Group**
  - Create `src/app/(authenticated)/layout.tsx`.
  - Implementation: 
    - Desktop: A three-column grid (LeftSidebar | Main Content | RightSidebar).
    - Mobile: A Top Header with Hamburger menu + Center Main Content.
- [ ] **Task 4.3: Mock Dashboard Page**
  - Create `src/app/(authenticated)/feed/page.tsx`.
  - Implementation: A simple dummy feed page to verify the layout works in a real route.
