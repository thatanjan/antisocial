# Implementation Plan: Create Post

**Branch**: `004-create-post` | **Date**: 2026-01-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-create-post/spec.md`

## Summary

Implement the "Create Post" feature allowing users to share content with up to 10 images and/or a text description (max 1000 characters). 
The feature includes:
1. A modal-based creation interface.
2. Client-side image optimization and aspect ratio selection (16:9, 1:1, 4:5).
3. Integration with **ImageKit.io** for image storage and processing.
4. Collapsible post descriptions (2-line preview) and image carousels in the feed.
5. Post-creation redirection to the post detail page.

## Technical Context

**Language/Version**: TypeScript (strict mode)  
**Framework**: Next.js (App Router, latest stable)  
**Primary Dependencies**: Shadcn UI, React Hook Form, Zod, Better Auth  
**Image Storage**: ImageKit.io  
**ORM**: Prisma  
**Storage**: PostgreSQL  
**Testing**: Not required  
**Target Platform**: Web (modern browsers)  
**Project Type**: Next.js web application  
**Performance Goals**: Image optimization on client to reduce upload bandwidth; Fast redirection post-creation.  
**Constraints**: Max 10 images; Max 1000 characters description.  
**Scale/Scope**: Core feature for social interaction.

## Constitution Check

- [x] Shadcn components used (Dialog for modal, Carousel for display)
- [x] Server Components by default (Client components for the creation form and carousel)
- [x] Server Actions for post persistence
- [x] TSDoc comments on all exports
- [x] Colors defined as CSS variables
- [x] KISS & DRY principles followed
- [x] Feature-based file structure enforced

## Project Structure

### Documentation (this feature)

```text
specs/004-create-post/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code

```text
src/
├── app/
│   ├── post/[id]/page.tsx   # Post detail page
│   └── (dashboard)/feed/page.tsx # Existing feed page (update to include Create Post button)
├── components/
│   └── ui/                  # Shadcn components (Carousel, Dialog, etc.)
├── features/
│   └── create-post/
│       ├── components/      # PostCreationModal, ImageUploader, CarouselDisplay, CollapsibleText
│       ├── actions/         # createPostAction
│       ├── hooks/           # useImageOptimization
│       ├── utils/           # imageUtils
│       └── types/           # index.ts
├── lib/
│   └── imagekit.ts          # ImageKit client configuration
```

**Structure Decision**: Concentrating logic in `src/features/create-post/` to keep it self-contained. Global components like the Carousel will reside in `src/components/ui/` if they are generic.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Client Components | Required for interactive form and carousel | Interactivity necessitates "use client" |
