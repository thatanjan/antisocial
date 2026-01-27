# Data Model: Application Side Navigations

## Mock Entities

### MockUser
Represents the current user's profile information.
- `id`: string
- `name`: string
- `handle`: string
- `avatar`: string (URL)
- `location`: string
- `stats`: 
    - `posts`: number
    - `followers`: number
    - `following`: number

### NavItem
Represents a navigation link in the left sidebar.
- `label`: string
- `href`: string
- `icon`: LucideIconName
- `badgeCount?`: number

### MockSocialItem
Common interface for Friend Requests and Suggestions.
- `id`: string
- `name`: string
- `handle`: string
- `avatar`: string
- `status?`: 'active' | 'pending' | 'suggested'
