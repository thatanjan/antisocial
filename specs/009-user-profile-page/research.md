# Research: User Profile Page

## Decisions

### Decision: Profile Page Route Structure
- **Decision**: Use `/profile/[username]` route pattern
- **Rationale**: User-friendly URLs that identify users by their username, more readable than IDs
- **Alternatives considered**: `/user/[id]` (less user-friendly), query params `?user=username` (ugly URLs)

### Decision: Profile Page Component Structure
- **Decision**: Create new feature in `src/features/user-profile/` with:
  - `components/ProfileHeader.tsx` - Profile card with avatar, name, bio, counts
  - `components/ProfileTabs.tsx` - Tab navigation (Posts, Shorts, Tags, Activity)
  - `components/ProfilePage.tsx` - Main profile page component
- **Rationale**: Follows constitution's feature-based file structure
- **Alternatives considered**: Adding to existing features (violates separation of concerns)

### Decision: Cover Image Handling
- **Decision**: Use a gradient or placeholder for cover image initially; user can upload later
- **Rationale**: Design shows cover image but feature spec doesn't specify upload functionality
- **Alternatives considered**: Skip cover image entirely (poor UX), require upload (blocks initial implementation)

### Decision: Tab Content Implementation
- **Decision**: Only implement "Posts" tab initially; other tabs (Shorts, Tags, Activity) are placeholders
- **Rationale**: Posts are the primary content; other features may not exist yet
- **Alternatives considered**: Implement all tabs (requires Shorts, Tags, Activity features to exist)

### Decision: Follow/Unfollow in Profile Header
- **Decision**: Reuse existing follow actions from `src/features/follow/actions/`
- **Rationale**: DRY principle - follow functionality already exists
- **Alternatives considered**: Create duplicate follow logic (violates DRY)

### Decision: Client vs Server Components
- **Decision**: Profile page wrapper is Server Component; Tabs require "use client" for state management
- **Rationale**: Server component for data fetching; client component needed for tab switching interactivity
- **Alternatives considered**: All client (worse performance), all server (can't handle tab switching)

## Resolved NEEDS CLARIFICATION

1. **Profile URL pattern**: `/profile/[username]` chosen for user-friendly URLs
2. **Cover image implementation**: Gradient placeholder initially, upload functionality deferred
3. **Tab implementation scope**: Only Posts tab fully implemented initially
