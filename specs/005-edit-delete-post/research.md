# Research: Edit and Delete Post

## Decision: Shadcn DropdownMenu & Dialogs
- **Choice**: Use `DropdownMenu` for the "3 dots" trigger.
- **Rationale**: Standard UI pattern for secondary actions like Edit/Delete.
- **Alternatives considered**: Context menu (right click), but 3 dots is more discoverable on mobile and web.

## Decision: ImageKit Deletion
- **Choice**: Use ImageKit Server SDK to delete images by `fileId` when a post is deleted.
- **Rationale**: Ensures storage costs are managed and no orphaned assets remain. `fileId` is already stored in the `PostImage` entity.

## Decision: Small Image Preview in Edit Dialog
- **Choice**: Horizontal scroll or grid of small thumbnails (e.g., 60x60px) in the edit dialog.
- **Rationale**: Constant reminder of what is being edited without taking up too much space. The user cannot change images, so this is for context ONLY.

## Best Practices for Server Actions
- Use `useActionState` or direct invocation in `Transition` for loading states.
- Revalidate paths (e.g., `/feed`, `/profile/[id]`) after successful mutations using `revalidatePath`.
- Optimistic UI updates for deletion can be implemented using `useOptimistic` if performance feels laggy.
