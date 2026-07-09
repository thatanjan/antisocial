# Data Model: News Feed Final Customization

## Overview

This feature extends the existing `NavItem` type to support a disabled state. No database entities are involved — all changes are in-memory component state.

## Entities

### NavItem (Extended)

| Field | Type | Required | Description | Change |
|-------|------|----------|-------------|--------|
| `label` | `string` | Yes | Display label for the nav link | Unchanged |
| `href` | `string` | Yes | Destination route path | Unchanged |
| `icon` | `string` | Yes | Name of Lucide icon to display | Unchanged |
| `badgeCount` | `number` | No | Notification/badge count | Unchanged |
| `disabled` | `boolean` | No | When true, item appears disabled with title tooltip | **New** |

### Validation Rules

- If `disabled: true`, the item MUST NOT navigate (ignore click)
- If `disabled: true`, the item MUST show "coming soon" title tooltip on hover (native HTML `title` attribute)
- If `disabled` is `undefined` or `false`, the item behaves as a normal link
- `Feed` and `Settings` items MUST have `disabled: false` or omit the field

### State Transitions

```
Normal Link ──(disabled: true)──> Disabled Item (no navigation, shows title tooltip)
Disabled Item ──(disabled: false/remove)──> Normal Link
```

No runtime state transitions required — disabled state is static based on mock data configuration.
