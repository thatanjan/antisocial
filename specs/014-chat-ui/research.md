# Research: Chat UI

## Decision: Use the existing Next.js App Router and feature architecture

- **Decision**: Add the `/chat` route under the dedicated `apps/web/src/app/(chat)/` layout group, separate from `apps/web/src/app/(authenticated)/`. Keep chat-specific UI and data in `apps/web/src/features/chat/`.
- **Rationale**: The user requires a separate chat layout group for route source; feature-related components, types, and data remain in the existing feature-based architecture.
- **Alternatives considered**: Place the route under `(authenticated)` or move all chat source into the App Router group. Rejected because the route must have its own layout boundary while reusable chat feature code belongs under `features/`.

## Decision: Keep the page server-rendered and isolate required interactions in a client component

- **Decision**: Make the route and initial page shell React Server Components; use a focused client-rendered chat workspace for in-memory selection, filtering, new-chat selection, message sending, and narrow-screen list/chat switching.
- **Rationale**: These interactions require browser event handlers and session-local state, but static layout, sample data, route metadata, and outer composition do not. This follows the user's server-component-first requirement while limiting client behavior to what the UI needs.
- **Alternatives considered**: A purely server-rendered interface cannot update this frontend-only experience without submitting to a server; making the entire route a client component moves static rendering and sample data unnecessarily to the browser.

## Decision: Keep chat state in component memory; do not add a backend or browser persistence

- **Decision**: Seed conversations, contacts, and messages from local sample data and keep new messages/conversations in active page state only.
- **Rationale**: The specification explicitly requires demo interactions that reset on reload and excludes backend logic. No database schema, server actions, API routes, or local-storage layer is needed.
- **Alternatives considered**: Persistence via Prisma or browser storage. Rejected because it violates the no-backend/reload-reset boundary and adds unnecessary state infrastructure.

## Decision: Reuse installed dependencies, shadcn primitives, and global theme tokens

- **Decision**: Use the already installed React, Next.js, `lucide-react`, and shadcn components. Use semantic classes from `apps/web/src/app/globals.css`; use standard Tailwind palette classes for missing colors and standard Tailwind size scales only.
- **Rationale**: These dependencies and primitives are already available. The active global theme already provides background/foreground, card, muted, accent, primary, border, and ring tokens; the primary is terracotta-toned. Existing root fonts already load DM Sans and DM Mono. Do not add CDN Tailwind, inline styles, new colors, arbitrary values, or another icon library.
- **Alternatives considered**: Copying Stitch markup/styles, importing Google fonts in this page, extending the theme for design colors, or installing dependencies. Rejected because project tokens and fonts cover the needed look, and the user's explicit styling constraints prohibit those additions without approval.

## Decision: Use accessible native controls and available shadcn components for interaction

- **Decision**: Use existing shadcn Button, Input, Dialog, and Avatar primitives where suitable, and Lucide icons for all icons. Prefer standard semantic buttons, links, and forms; unsupported sample call/attachment/presence controls must not imply a successful operation.
- **Rationale**: These choices reuse the installed UI kit, preserve keyboard/accessibility semantics, and avoid simulated backend features.
- **Alternatives considered**: Custom icon SVGs, bespoke controls, or functional mock calls/uploads. Rejected because Lucide and shadcn exist and backend-dependent features are explicitly out of scope.

## Decision: Use the dedicated chat layout group without changing global navigation

- **Decision**: Reuse the dedicated chat layout group for route-level composition and the existing feature directory for chat implementation. Do not alter global navigation.
- **Rationale**: A layout group isolates chat route source without duplicating navigation or coupling feature components to a route.
- **Alternatives considered**: Put the route under `(authenticated)` or duplicate a site-wide navigation rail. Rejected because the user requested a separate group and navigation changes exceed feature scope.

## Technical unknowns resolved

- **Interactive client boundary**: Required only for client-side message/list state, input events, dialogs, and responsive view selection.
- **Persistence/backend integration**: None; all sample and new chat data is in-memory and is reset on reload.
- **Database or schema changes**: None; no Prisma model or migration is warranted.
- **External interfaces**: None; no API or server action is exposed by this frontend-only feature.
- **Unresolved technical unknowns**: None.
