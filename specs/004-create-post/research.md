# Research: Create Post Feature

## Decision 1: Image Storage & Upload
- **Choice**: Direct client-side upload to **ImageKit.io** using `@imagekit/next`.
- **Rationale**: 
    - Reduces server load by uploading directly from the browser.
    - ImageKit provides real-time transformations (cropping, resizing).
    - SDK support for Next.js is robust.
- **Workflow**:
    1. Server Action or API Route `/api/upload-auth` generates a signature using `imagekit-node`.
    2. Client Sidebar/Modal fetches this signature.
    3. Client uses `IKUpload` or the ImageKit SDK to push optimized blobs.

## Decision 2: Client-side Image Optimization
- **Choice**: `browser-image-compression`.
- **Rationale**: 
    - Lightweight, handles Web Workers for non-blocking UI.
    - Simple API for reducing `maxSizeMB` and `maxWidthOrHeight`.
- **Implementation**: Before uploading to ImageKit, the file is passed through `imageCompression(file, options)`.

## Decision 3: Image Transformations (Aspect Ratios)
- **Choice**: Use ImageKit's URL-based transformations.
- **Rationale**: Instead of cropping on the client (which is complex to implement perfectly), we can send the intended aspect ratio metadata to ImageKit or simply apply CSS aspect-ratio on the display side while using ImageKit's `ar-` transformation in the URL.
- **Aspect Ratios**: 
    - 16:9 (`ar-16-9`)
    - 1:1 (`ar-1-1`)
    - 4:5 (`ar-4-5`)

## Decision 4: UI Components
- **Modal**: Shadcn `Dialog`.
- **Carousel**: Shadcn `Carousel` (Embla).
- **Collapsible Text**: Custom implementation using Tailwind `line-clamp-2` and a "See more" button.

## Alternatives Considered
- **Server Upload**: Rejected to save bandwidth and server resources.
- **Canvas-based Optimization**: Rejected in favor of `browser-image-compression` for better reliability and ease of use.
- **Framer Motion for Carousel**: Rejected to stay consistent with the Constitution (Shadcn UI).

## API & Schema Integration
- **Post Persistence**: Server Action `createPostAction` will receive the text and the list of ImageKit file IDs/URLs.
- **Data Model**: A `Post` entity with a relation to `PostImage`.
