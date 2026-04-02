# Data Model: User Profile Page

## Entities

### User
Represents the profile owner displayed on the page.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| name | String | Display name |
| username | String | Unique username for URL |
| bio | String? | User's biography/description |
| image | String? | Profile picture URL |
| createdAt | DateTime | Account creation date |
| followerCount | Int | Number of followers |
| followingCount | Int | Number of users followed |

**Relationships**:
- Has many Posts (authored content)
- Has many Follows (as follower and followee)

### Post
Represents content displayed in the profile's posts tab.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| authorId | String | Foreign key to User |
| content | String? | Text content of the post |
| createdAt | DateTime | Post creation timestamp |
| likeCount | Int | Number of likes |
| commentCount | Int | Number of comments |
| isPinned | Boolean | Whether post is pinned to profile |

**Relationships**:
- Belongs to User (author)
- Has many PostImages
- Has many PostLikes

### Follow
Represents follow relationship between users.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier (CUID) |
| followerId | String | User who follows |
| followeeId | String | User being followed |
| createdAt | DateTime | When follow occurred |

**Constraints**:
- Unique pair (followerId, followeeId)
- Self-follows are not allowed

## State Transitions

### Follow Status
```
Not Following -> [Click Follow] -> Following
Following -> [Click Unfollow] -> Not Following
```

### Tab Selection
```
Posts (default) -> [Click Tab] -> Shorts | Tags | Activity
```

## Validation Rules

1. **Profile Not Found**: Return 404 state when username doesn't match any user
2. **Private Profile**: Not applicable initially (no privacy settings)
3. **Empty Posts**: Show empty state message when user has no posts
4. **Own Profile**: Show "Edit Profile" button instead of "Follow" button
5. **Other User Profile**: Show "Follow" or "Unfollow" button based on follow status
