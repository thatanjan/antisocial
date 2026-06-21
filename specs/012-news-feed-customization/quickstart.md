# Quickstart: News Feed Final Customization

## Prerequisites

- Feature branch: `012-news-feed-customization`
- All constitution gates pass
- Spec and research complete

## Implementation Order

### Step 1: Extend NavItem Type

**File**: `src/features/navigation/types/index.ts`

Add `disabled?: boolean` to the `NavItem` interface.

### Step 2: Update NavItem mock data

**File**: `src/features/navigation/utils/mock-data.ts`

Add `disabled: true` to Explore, My Favorites, Direct, Stats items.

### Step 3: Update NavLinkItem component

**File**: `src/features/navigation/components/NavLinkItem.tsx`

- Check `item.disabled`
- If disabled: render `<span>` with muted styling and native `title="coming soon"`
- If not disabled: render existing `<Link>` unchanged

### Step 4: Update LeftSidebar

**File**: `src/features/navigation/components/LeftSidebar.tsx`

- Replace `sticky top-0` with `fixed top-0 left-0` on the `<aside>`
- Remove `ScrollArea` wrapper
- Remove `ScrollArea` import

### Step 5: Update RightSidebar

**File**: `src/features/navigation/components/RightSidebar.tsx`

- Replace `sticky top-0` with `fixed top-0 right-0` on the `<aside>`
- Remove `ScrollArea` wrapper
- Remove the "Social Requests" `<section>` block (lines 22-50)
- Remove `socialRequests` and `SocialRequestItem` imports

### Step 6: Update MobileNav

**File**: `src/features/navigation/components/MobileNav.tsx`

- Remove the requests section (lines 93-100)
- Remove `socialRequests` and `SocialRequestItem` imports if no longer used elsewhere in the file

### Step 7: Update Layout

**File**: `src/app/(authenticated)/layout.tsx`

- Add left/right padding on the `<main>` element to account for fixed sidebars
- Sidebars use `fixed` positioning, so the flex container no longer automatically allocates space for them

### Step 8: Verify

1. Load the feed page
2. Scroll down — both sidebars should stay fixed in place
3. Check right sidebar — no "Requests" section visible
4. Hover each disabled nav item — "coming soon" title tooltip appears
5. Click each disabled nav item — no navigation occurs
6. Click Feed and Settings — they navigate normally
7. Check mobile view — disabled items also show title tooltips, no requests section
