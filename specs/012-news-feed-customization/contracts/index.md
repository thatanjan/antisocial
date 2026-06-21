# Interface Contracts: News Feed Final Customization

## NavItem Type Contract

```typescript
interface NavItem {
  label: string;
  href: string;
  icon: string;      // Name of Lucide icon (e.g., "LayoutGrid", "Compass")
  badgeCount?: number;
  disabled?: boolean; // NEW — when true, item is non-interactive with "coming soon" title tooltip
}
```

## NavLinkItem Component Contract

```typescript
interface NavLinkItemProps {
  item: NavItem;
}
```

**Behavioral Contract**:
- When `item.disabled === true`:
  - Renders as a `<span>` (not `<Link>`) with muted/disabled styling
  - Has native `title="coming soon"` for hover tooltip
  - Click does not navigate or change URL
  - Does not appear as "active" regardless of current pathname
- When `item.disabled` is falsy or undefined:
  - Renders as `<Link>` with existing behavior (navigation, active state)
  - No title attribute added

## Sidebar Contract (Left & Right)

- Sidebar MUST use `position: fixed` to stay in viewport on scroll
- Sidebar MUST NOT use `ScrollArea` — internal content should not scroll independently
- Sidebar MUST maintain the same responsive visibility breakpoints (md: for left, xl: for right)
- Sidebar height MUST be `h-screen` to fill the viewport

## Right Sidebar Contract

- MUST NOT render any "Requests" heading, request items, or request-related UI
- The word "Requests" and the `socialRequests` data must not appear in the JSX

## Mobile Nav Contract

- MUST NOT render the requests section in the mobile drawer
- Nav items in the mobile drawer MUST respect the `disabled` flag (same behavior as desktop sidebar)
