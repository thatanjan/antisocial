# Chat UI Contract

## Scope

The authenticated chat page is a user-facing frontend surface backed only by bundled sample data and in-memory page state. This contract defines observable UI behavior. It introduces no API, server action, database, or durable data contract.

## Route and rendering

- The chat surface lives in the dedicated `(chat)` App Router layout group in `apps/web/src/app/(chat)/`, outside `(authenticated)`:
  - `layout.tsx` permanently renders the shared chrome: `LeftIconRail` + `ConversationsSidebar` at desktop widths; `MobileChatListScreen` + `BottomTabBar` at narrow widths.
  - `page.tsx` at `/chat` renders an empty right pane; on narrow screens it renders the list full-screen.
  - `[id]/page.tsx` at `/chat/[id]` renders the selected conversation (`ChatScreen`) beside the permanent list; on narrow screens it renders only the conversation with a Back control returning to `/chat`.
- The route pages and static shell render as server components. Interactive parts (composer, send state) are client-rendered.
- Conversation selection is URL-driven: list items link to `/chat/[id]`; the active conversation id comes from the route param.

## Conversation list behavior

- The initial list contains bundled sample conversations.
- Search matches displayed participant or conversation names without case sensitivity and can be combined with one category filter.
- All, Unread, Favourites, and Groups select the corresponding list view. No matches produce a visible empty state; clearing search or selecting All allows recovery.
- Selecting a conversation shows its own title, sample message history, and composer.
- New Conversation opens a chooser populated only by bundled sample contacts. Choosing an existing direct participant opens their current conversation; otherwise, a new empty local conversation is created for the current page session. Cancel closes the chooser without state changes.

## Message composer behavior

- The composer uses an auto-resizing multiline textarea that grows to five lines, then scrolls internally.
- Enter submits the draft; Shift+Enter inserts a newline.
- Submission trims text. Empty or whitespace-only text creates no message and does not clear or alter existing history.
- A successful local submission adds one outgoing message, clears the composer, updates the conversation preview, and keeps the message visible when switching conversations.
- This behavior is a local UI simulation; it MUST NOT announce delivery, read, or remote receipt.
- Page reload resets all changed data to the bundled sample data.

## Accessibility and design constraints

- Interactive controls expose accessible names, support keyboard operation, and have visible focus treatment.
- Use existing shadcn UI primitives, Lucide React icons, Tailwind utility classes, and semantic theme tokens from `apps/web/src/app/globals.css`; standard Tailwind palette classes are allowed where those tokens do not define a color.
- Do not use arbitrary Tailwind values or add colors to the theme for this feature.
- Desktop and mobile visual references are `stitch-screen/chat-page.html`, `stitch-screen/chat-page-mobile-chatlist.html`, and `stitch-screen/chat-page-mobile.html`.
- Calls, voice recording, attachments, and real-time presence are not implemented. Any displayed samples for these are inert and cannot claim a successful live operation.
