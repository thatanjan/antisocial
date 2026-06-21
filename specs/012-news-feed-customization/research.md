# Research: News Feed Final Customization

## Overview

All technical decisions for this feature. No NEEDS CLARIFICATION items — every aspect is well-defined.

---

## 1. Sidebar Fixed Positioning

**Decision**: Replace `sticky top-0` + `ScrollArea` pattern with `fixed` positioning for both sidebars.

**Rationale**: 
- `sticky top-0` can behave inconsistently when parent containers have transforms or complex flex layouts
- `fixed` guarantees the sidebars stay in viewport position regardless of scroll or parent layout
- The sidebar content is shorter than viewport height (navigation, profile, search, suggestions), so no internal scroll is needed
- Removing `ScrollArea` eliminates potential nested scroll conflicts

**Alternatives considered**:
- Keeping `sticky top-0` (current approach) — already in place but user reports it doesn't stay fixed properly
- Using `sticky` with `overflow-visible` — problematic because sidebar could extend beyond viewport

**Implementation**:
- Left sidebar: `fixed top-0 left-0` with appropriate left offset for the container centering
- Right sidebar: `fixed top-0 right-0` with appropriate right offset
- Main content: needs left/right margin/padding to avoid overlapping with fixed sidebars
- Remove `ScrollArea` wrappers from both sidebars

---

## 2. Remove Requests Section

**Decision**: Delete the "Social Requests" JSX block from `RightSidebar.tsx` and remove `socialRequests` import.

**Rationale**: The spec is clear — remove the entire section. No data changes needed since requests are mock data.

**Also affected**: `MobileNav.tsx` has a compact requests section that must also be removed.

**Alternatives considered**: Conditional hiding based on a feature flag — unnecessary for permanent removal.

---

## 3. Disable Nav Items with Title Tooltip

**Decision**: Extend `NavItem` type with optional `disabled` field; extend `NavLinkItem` to render disabled state with native HTML `title="coming soon"`.

**Rationale**:
- Adding a `disabled?: boolean` field to `NavItem` is the cleanest approach — it's declarative and the mock data already defines the nav items
- Native `title` attribute provides hover tooltip without extra dependencies
- Disabled items render as `<span>` (not `<Link>`) with muted styling and `cursor-not-allowed`
- `title` attribute shows "coming soon" on hover natively

**Alternatives considered**:
- Shadcn Tooltip component — extra dependency, overkill for static text tooltip
- Wrapping `NavLinkItem` with a separate outer disabled component — adds unnecessary wrapper layers
- Creating separate disabled-link components — violates DRY, over-engineering for 4 items

**Implementation**:
- Update `NavLinkItem` to check `item.disabled`
- If disabled: render `<span>` with muted styling and `title="coming soon"`
- If not disabled: render existing `<Link>`
- Update `mock-data.ts` to add `disabled: true` to Explore, My Favorites, Direct, Stats

---

## Affected Files

| File | Change Type | Description |
|------|------------|-------------|
| `src/features/navigation/types/index.ts` | Modify | Add `disabled?: boolean` to `NavItem` |
| `src/features/navigation/utils/mock-data.ts` | Modify | Add `disabled: true` to 4 nav items |
| `src/features/navigation/components/NavLinkItem.tsx` | Modify | Render disabled state + title tooltip |
| `src/features/navigation/components/LeftSidebar.tsx` | Modify | Fixed positioning, remove ScrollArea |
| `src/features/navigation/components/RightSidebar.tsx` | Modify | Fixed positioning, remove ScrollArea, remove Requests section |
| `src/features/navigation/components/MobileNav.tsx` | Modify | Remove Requests section |
| `src/app/(authenticated)/layout.tsx` | Modify | Add padding for fixed sidebars |

