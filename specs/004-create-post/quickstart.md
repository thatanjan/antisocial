# Quickstart: Create Post

## Prerequisites

1. **ImageKit.io Account**:
   - Obtain `IMAGEKIT_PUBLIC_KEY`
   - Obtain `IMAGEKIT_PRIVATE_KEY`
   - Obtain `IMAGEKIT_URL_ENDPOINT`
   - Add these to `.env`:
     ```env
     NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=...
     IMAGEKIT_PRIVATE_KEY=...
     NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=...
     ```

2. **Dependencies**:
   ```bash
   npm install imagekit imagekit-javascript @imagekit/next browser-image-compression
   npx shadcn@latest add dialog carousel card
   ```

## Development Steps

1. **Database**: Update `prisma/schema.prisma` with `Post` and `PostImage` models. Run `npx prisma generate`.
2. **Auth Route**: Implement `src/app/api/upload-auth/route.ts` using `imagekit-node` to return signature/token.
3. **Modal Component**: Build `src/features/create-post/components/PostCreationModal.tsx`.
    - Integrate `browser-image-compression`.
    - Use `@imagekit/next` for direct upload.
    - Implement Zod validation.
4. **Server Action**: Build `src/features/create-post/actions/index.ts` to save records to PostgreSQL.
5. **Feed Update**: Add "Create Post" button to the main feed and implement `CarouselDisplay` and `CollapsibleText` for post viewing.

## Verification

1. Click "Create Post".
2. Select 11 images (should fail validation).
3. Select 1 image, Choose 16:9 ratio, type > 1000 chars (should fail validation).
4. Select valid image + text, click Create.
5. Observe loading state.
6. Verify redirect to `/post/[id]`.
7. Check feed for carousel and truncated text.
