# Quickstart: Edit and Delete Post

## Setup
1. Ensure you are on the `005-edit-delete-post` branch.
2. Run `npm install` to ensure all dependencies are resolved.
3. Add Shadcn components:
   ```bash
   npx shadcn@latest add dropdown-menu alert-dialog
   ```

## Development
1. Start the dev server: `npm run dev`.
2. Login to the application.
3. Navigate to the feed.
4. On a post you OWN, click the 3-dots icon.
5. Select "Edit" to modify the text.
6. Select "Delete" and confirm to remove the post.

## Testing
- Verify that non-owners cannot see the 3-dots icon.
- Verify that images remain unchanged after a text edit.
- Verify that deleting a post removes it from the feed immediately.
